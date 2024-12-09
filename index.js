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

// Connect to MongoDB
connectDB();

// Set io instance
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Chat API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/private', privateChatRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle user authentication on socket connection
  socket.on('authenticate', async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (user) {
        socket.userId = user._id;
        user.status = 'online';
        await user.save();
        io.emit('userStatus', { userId: user._id, status: 'online' });
      }
    } catch (error) {
      console.error('Socket authentication error:', error);
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

// Start server
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
