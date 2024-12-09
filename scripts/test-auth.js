const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';

// Generate unique test user credentials
const timestamp = Date.now();
const testUser = {
  username: `testuser_${timestamp}`,
  email: `testuser_${timestamp}@example.com`,
  password: 'password123'
};

// Add request logging
axios.interceptors.request.use(request => {
  console.log('Making request to:', request.url);
  return request;
});

async function testAuth() {
  try {
    console.log('\nTesting authentication flow...');
    console.log('\n1. Attempting to register new user...');
    // 1. Register a new user
    const registerResponse = await axios.post(`${API_URL}/api/auth/register`, {
      username: testUser.username,
      email: testUser.email,
      password: testUser.password
    });
    console.log('\nRegistration successful:', registerResponse.data);

    console.log('\n2. Attempting to login...');
    // 2. Login with the new user
    const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('\nLogin successful:', loginResponse.data);

    console.log('\n3. Testing authenticated endpoint...');
    // 3. Test authenticated endpoint
    const token = loginResponse.data.token;
    const testResponse = await axios.get(`${API_URL}/api/auth/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('\nAuthenticated request successful:', testResponse.data);

  } catch (error) {
    console.error('\nError occurred:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server responded with error:', {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server. Is the server running?');
      console.error('Make sure to:');
      console.error('1. Start the server with: npm run dev');
      console.error(`2. Server should be running at: ${API_URL}`);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
  }
}

// Check if server is running first
axios.get(API_URL)
  .then(() => {
    console.log('Server is running, starting tests...');
    testAuth();
  })
  .catch(error => {
    console.error('\nCannot connect to server!');
    console.error(`Failed to connect to ${API_URL}`);
    console.error('\nPlease make sure to:');
    console.error('1. Start the server with: npm run dev');
    console.error('2. Check if the server is running on the correct port');
    console.error('3. Verify your .env configuration');
  }); 