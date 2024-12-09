const io = require('socket.io-client');
const jwt = require('jsonwebtoken');

function createSocketClient(user, options = {}) {
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  
  return io('http://localhost:3000', {
    auth: { token },
    transports: ['websocket'],
    ...options
  });
}

module.exports = { createSocketClient }; 