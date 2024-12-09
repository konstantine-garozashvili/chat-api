require('../helpers/test-env');
const { setupTestServer, teardownTestServer } = require('../helpers/setup');
const request = require('supertest');

let server;
let baseUrl;

async function makeRequest(method, path, data = null) {
  const req = request(server)[method](path);
  
  if (data) {
    req.send(data).set('Content-Type', 'application/json');
  }
  
  try {
    const response = await req.timeout(5000);
    return response;
  } catch (error) {
    console.error(`Request failed: ${method.toUpperCase()} ${path}`, {
      error: error.message,
      response: error.response?.body,
      status: error.response?.status,
      url: `${baseUrl}${path}`
    });
    throw error;
  }
}

async function testWidgetIntegration() {
  try {
    // Setup test server
    console.log('Setting up test server...');
    const setup = await setupTestServer();
    server = setup.server;
    baseUrl = setup.baseUrl;

    console.log(`\n🔄 Testing with server at ${baseUrl}`);

    // Step 1: Register new user
    console.log('\n🔄 Step 1: Registering new user...');
    const registerData = {
      username: `testwidget_${Date.now()}`,
      email: `testwidget_${Date.now()}@example.com`,
      password: 'password123'
    };

    console.log('Registration data:', registerData);

    try {
      const registerResponse = await makeRequest(
        'post', 
        '/api/auth/register-test',
        registerData
      );

      console.log('Registration response:', registerResponse.body);

      const { apiKey, id: userId } = registerResponse.body.user;
      const { token } = registerResponse.body;

      console.log('✅ Successfully registered');
      console.log('API Key:', apiKey);
      console.log('User ID:', userId);

      // Create test HTML file
      const fs = require('fs').promises;
      const testHtml = await fs.readFile('example/test-widget.html', 'utf8');
      const updatedHtml = testHtml
        .replace('YOUR_API_KEY', apiKey)
        .replace('Loading...', apiKey);
      await fs.writeFile('example/test-widget.html', updatedHtml);

      console.log('\n✨ Test completed successfully!');
      console.log('\n=== Integration Instructions ===');
      console.log('1. Start the server: npm run dev');
      console.log('2. Open example/test-widget.html in your browser');
      console.log('3. Your API key:', apiKey);

    } catch (error) {
      console.error('Registration request failed:', {
        error: error.message,
        response: error.response?.body,
        status: error.response?.status
      });
      throw error;
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.body);
    }
    process.exit(1);
  } finally {
    await teardownTestServer();
  }
}

// Run the test
console.log('🚀 Starting widget integration test...');
testWidgetIntegration(); 