# Real-time Chat API

A flexible and scalable real-time chat API built with Node.js, Express, Socket.IO, and MongoDB.

## Author
Konstantine Garozashvili

## Features

- User Authentication (JWT)
- Real-time messaging
- Public chat rooms
- Private messaging
- Message status tracking (sent, delivered, read)
- User online/offline status
- Typing indicators
- Message history
- Room management

## Technologies

- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication
- Bcrypt for password hashing

## Installation

1. Clone the repository 
```bash
git clone https://github.com/konstantinegarozashvili/chat-api.git
```

2. Install dependencies
```bash
cd chat-api
npm install
```

3. Create .env file
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the server
```bash
npm run dev
```

## API Documentation

### Authentication Endpoints

All authenticated endpoints require the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Register User
```http
POST /api/auth/register
```

Request body:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "status": "offline"
  },
  "token": "jwt_token"
}
```

#### Login User
```http
POST /api/auth/login
```

Request body:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "status": "offline"
  },
  "token": "jwt_token"
}
```

### Room Endpoints

#### Create Room
```http
POST /api/rooms
```

Request body:
```json
{
  "name": "Room Name",
  "description": "Room Description",
  "type": "public"
}
```

#### Get All Rooms
```http
GET /api/rooms
```

#### Join Room
```http
POST /api/rooms/:roomId/join
```

### Chat Endpoints

#### Send Message
```http
POST /api/chat/messages
```

Headers:
```
Authorization: Bearer <your_token>
```

Request body:
```json
{
  "content": "Hello World!",
  "room": "room_id"
}
```

#### Get Room Messages
```http
GET /api/chat/messages/:room
```

### Private Chat Endpoints

#### Get or Create Private Chat
```http
GET /api/private/chat/:userId
```

#### Send Private Message
```http
POST /api/private/chat/:chatId/messages
```

Request body:
```json
{
  "content": "Hello privately!"
}
```

#### Update Message Status
```http
PUT /api/private/messages/:messageId/status
```

Request body:
```json
{
  "status": "read"
}
```

## Socket.IO Events

### Client Events (Emit)
```javascript
// Join a room
socket.emit('joinRoom', roomId);

// Leave a room
socket.emit('leaveRoom', roomId);

// User typing
socket.emit('typing', { room: roomId, username: 'user' });

// Stop typing
socket.emit('stopTyping', { room: roomId, username: 'user' });

// Authenticate socket
socket.emit('authenticate', token);
```

### Server Events (Listen)
```javascript
// New message
socket.on('newMessage', message => {});

// New private message
socket.on('newPrivateMessage', message => {});

// User status change
socket.on('userStatus', status => {});

// User typing status
socket.on('userTyping', data => {});

// Message status update
socket.on('messageStatusUpdate', update => {});
```

## License

MIT

## Contact

Konstantine Garozashvili - [GitHub](https://github.com/konstantinegarozashvili)

## Support

If you find this project useful, please give it a ⭐️ on GitHub!