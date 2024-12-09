const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';

// Add timeout to requests
axios.defaults.timeout = 5000;

async function checkServer() {
  try {
    await axios.get(API_URL);
    return true;
  } catch (error) {
    console.error('\nServer is not running!');
    console.error(`Could not connect to ${API_URL}`);
    console.error('\nPlease:');
    console.error('1. Make sure MongoDB is running');
    console.error('2. Start the server with: npm run dev');
    console.error('3. Check your .env configuration');
    console.error('\nError details:', error.message);
    return false;
  }
}

// Generate unique test user credentials
const timestamp = Date.now();
const testUsers = {
  user1: {
    username: `user1_${timestamp}`,
    email: `user1_${timestamp}@example.com`,
    password: 'password123'
  },
  user2: {
    username: `user2_${timestamp}`,
    email: `user2_${timestamp}@example.com`,
    password: 'password123'
  }
};

// Store tokens and IDs
let user1Token, user2Token, user1Id, user2Id, roomId, privateChatId, messageId;

async function runTests() {
  try {
    console.log('\n1. Testing User Registration and Authentication...');
    
    // Register user1
    const register1 = await axios.post(`${API_URL}/api/auth/register`, testUsers.user1);
    user1Token = register1.data.token;
    user1Id = register1.data.user.id;
    console.log('User1 registered successfully');

    // Register user2
    const register2 = await axios.post(`${API_URL}/api/auth/register`, testUsers.user2);
    user2Token = register2.data.token;
    user2Id = register2.data.user.id;
    console.log('User2 registered successfully');

    console.log('\n2. Testing Room Creation and Management...');
    
    // Create a room
    const room = await axios.post(`${API_URL}/api/rooms`, {
      name: `Test Room ${timestamp}`,
      description: 'Test room description',
      type: 'public'
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    roomId = room.data._id;
    console.log('Room created successfully');

    // User2 joins the room
    await axios.post(`${API_URL}/api/rooms/${roomId}/join`, {}, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    console.log('User2 joined the room');

    console.log('\n3. Testing Chat Messages...');
    
    // Send a message to the room
    const message = await axios.post(`${API_URL}/api/chat/messages`, {
      content: 'Hello from test script!',
      room: roomId
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    messageId = message.data._id;
    console.log('Message sent successfully');

    // Get room messages
    const messages = await axios.get(`${API_URL}/api/chat/messages/${roomId}`, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    console.log('Messages retrieved successfully');

    console.log('\n4. Testing Private Chat...');
    
    // Create private chat
    const privateChat = await axios.get(`${API_URL}/api/private/chat/${user2Id}`, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    privateChatId = privateChat.data._id;
    console.log('Private chat created');

    // Send private message
    const privateMessage = await axios.post(`${API_URL}/api/private/chat/${privateChatId}/messages`, {
      content: 'Hello privately!'
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    console.log('Private message sent');

    // Update message status
    await axios.put(`${API_URL}/api/private/messages/${privateMessage.data._id}/status`, {
      status: 'read'
    }, {
      headers: { Authorization: `Bearer ${user2Token}` }
    });
    console.log('Message status updated');

    console.log('\nAll tests completed successfully! 🎉');

  } catch (error) {
    console.error('\nError occurred:', {
      endpoint: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      error: error.response?.data || error.message,
      details: error.code === 'ECONNREFUSED' ? 'Server is not running' : error.message
    });
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\nPlease:');
      console.error('1. Make sure MongoDB is running');
      console.error('2. Start the server with: npm run dev');
      console.error('3. Check your .env configuration');
    }
  }
}

async function cleanup() {
  try {
    console.log('\nCleaning up test data...');
    
    let errors = [];
    
    // Refresh tokens before cleanup
    try {
      const loginResponse1 = await axios.post(`${API_URL}/api/auth/login`, {
        email: testUsers.user1.email,
        password: testUsers.user1.password
      });
      user1Token = loginResponse1.data.token;

      const loginResponse2 = await axios.post(`${API_URL}/api/auth/login`, {
        email: testUsers.user2.email,
        password: testUsers.user2.password
      });
      user2Token = loginResponse2.data.token;
    } catch (error) {
      console.error('Failed to refresh tokens:', error.message);
    }

    // Delete test room
    if (roomId) {
      try {
        await axios.delete(`${API_URL}/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${user1Token}` }
        });
        console.log('Room deleted successfully');
      } catch (error) {
        console.error('Room deletion error:', error.response?.data || error.message);
        errors.push(`Failed to delete room: ${error.message}`);
      }
    }
    
    // Delete test users
    try {
      await axios.delete(`${API_URL}/api/auth/users/${user1Id}`, {
        headers: { Authorization: `Bearer ${user1Token}` }
      });
      console.log('User1 deleted successfully');
    } catch (error) {
      console.error('User1 deletion error:', error.response?.data || error.message);
      errors.push(`Failed to delete user1: ${error.message}`);
    }
    
    try {
      await axios.delete(`${API_URL}/api/auth/users/${user2Id}`, {
        headers: { Authorization: `Bearer ${user2Token}` }
      });
      console.log('User2 deleted successfully');
    } catch (error) {
      console.error('User2 deletion error:', error.response?.data || error.message);
      errors.push(`Failed to delete user2: ${error.message}`);
    }
  
    if (errors.length > 0) {
      console.log('\nCleanup completed with some errors:');
      errors.forEach(error => console.log(`- ${error}`));
    } else {
      console.log('\nCleanup completed successfully');
    }
  } catch (error) {
    console.error('Error during cleanup:', error.message);
  }
}

// Run the tests
console.log('Starting API tests...');
checkServer()
  .then(isRunning => {
    if (isRunning) {
      return runTests()
        .then(() => {
          if (process.env.CLEANUP !== 'false') {
            return cleanup();
          }
        });
    }
  })
  .catch(console.error); 