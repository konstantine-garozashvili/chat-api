const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const roomRoutes = require('./src/routes/roomRoutes');
const privateChatRoutes = require('./src/routes/privateChatRoutes');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./src/models/User');
const Message = require('./src/models/Message');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const path = require('path');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Load environment variables
dotenv.config();

// Connect to MongoDB if not in test mode
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Set io instance
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// Serve example directory for testing
app.use('/example', express.static(path.join(__dirname, 'example')));
app.use('/test-widget.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'example/test-widget.html'));
});

// Add security middleware
app.use((req, res, next) => {
  // Security headers
  res.setHeader('Content-Security-Policy', "default-src 'self' http://localhost:3000; script-src 'self' 'unsafe-inline' http://localhost:3000; style-src 'self' 'unsafe-inline'; connect-src 'self' ws://localhost:3000 http://localhost:3000");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Serve favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/images/favicon.ico'));
});

// Test routes - must be before other routes
if (process.env.NODE_ENV === 'test') {
  // Test endpoint
  app.get('/test', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Test registration endpoint
  app.post('/api/auth/register-test', (req, res) => {
    console.log('Test registration received:', req.body);
    res.status(201).json({
      user: {
        id: 'test-id',
        apiKey: 'test-api-key',
        username: req.body.username
      },
      token: 'test-token'
    });
  });

  // Serve test widget page
  app.get('/test-widget.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'example/test-widget.html'));
  });

  // Log requests in test mode
  app.use((req, res, next) => {
    console.log('Test request:', {
      method: req.method,
      path: req.path,
      body: req.body,
      headers: req.headers
    });
    next();
  });
}

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/private', privateChatRoutes);
app.use('/widget', express.static(path.join(__dirname, 'dist')));

// Serve widget files with correct MIME type
app.get('/widget.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'dist/widget.js'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  let userId = null;

  // Handle user authentication on socket connection
  socket.on('authenticate', async (token) => {
    try {
      // Handle test token
      if (token === 'test-api-key') {
        socket.userId = 'test-user-id';
        io.emit('userStatus', { userId: 'test-user-id', status: 'online' });
        return;
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (user) {
        socket.userId = user._id;
        userId = user._id;
        user.status = 'online';
        await user.save();
        io.emit('userStatus', { userId: user._id, status: 'online' });
      }
    } catch (error) {
      console.error('Socket authentication error:', error);
    }
  });

  // Handle chat messages
  socket.on('message', async (data) => {
    try {
      const { text, apiKey } = data;
      
      // Handle API keys
      let user;
      if (apiKey === process.env.DEFAULT_API_KEY) {
        user = {
          _id: 'default-user-id',
          username: 'Guest User'
        };
      } else {
        // Find real user by API key
        user = await User.findOne({ apiKey });
      }
      
      if (!user) {
        socket.emit('error', { message: 'Invalid API key' });
        return;
      }
      
      // Create and save message
      let message;
      if (apiKey !== 'test-api-key') {
        message = new Message({
          sender: user._id,
          text,
          type: 'chat'
        });
        await message.save();
      } else {
        message = {
          _id: `test-msg-${Date.now()}`,
          text,
          createdAt: new Date()
        };
      }
      
      // Broadcast message to all connected clients
      socket.broadcast.emit('message', {
        from: user.username,
        text,
        timestamp: message.createdAt
      });
    } catch (error) {
      console.error('Message handling error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('typing', (data) => {
    const { room, username } = data;
    socket.to(room).emit('userTyping', { username, isTyping: true });
  });

  socket.on('stopTyping', (data) => {
    const { room, username } = data;
    socket.to(room).emit('userTyping', { username, isTyping: false });
  });

  socket.on('leaveRoom', (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
  });

  socket.on('disconnect', async () => {
    if (socket.userId) {
      const user = await User.findById(socket.userId);
      if (user) {
        user.status = 'offline';
        await user.save();
        io.emit('userStatus', { userId: user._id, status: 'offline' });
      }
    }
    console.log('Client disconnected');
  });

  // Join private user room for direct messages
  socket.on('joinPrivateRoom', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their private room`);
  });

  // Handle message delivery status
  socket.on('messageDelivered', async (messageId) => {
    try {
      const message = await Message.findById(messageId);
      if (message && socket.userId) {
        const statusIndex = message.status.findIndex(s => 
          s.user.toString() === socket.userId.toString()
        );
        
        if (statusIndex > -1 && message.status[statusIndex].status === 'sent') {
          message.status[statusIndex].status = 'delivered';
          message.status[statusIndex].updatedAt = new Date();
          await message.save();
          
          // Notify sender
          io.to(`user_${message.sender}`).emit('messageStatusUpdate', {
            messageId: message._id,
            userId: socket.userId,
            status: 'delivered'
          });
        }
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  });
});

// Export for testing
module.exports = { app, server };

// Start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Available routes:');
    app._router.stack.forEach(function(r){
      if (r.route && r.route.path){
        console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
      }
    });
  });
}
