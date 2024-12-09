const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { app } = require('../../index');
const http = require('http');
const io = require('socket.io');

let mongod;
let server;
let socketServer;

async function setupTestServer() {
  try {
    // Set test environment
    process.env.NODE_ENV = 'test';
    
    // Disconnect from any existing connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    console.log('Starting MongoDB Memory Server...');
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    
    console.log('Connecting to test database...');
    await mongoose.connect(mongoUri);

    // Create server
    server = http.createServer(app);
    socketServer = io(server);
    app.set('io', socketServer);

    // Start server
    return new Promise((resolve, reject) => {
      const port = 3002;
      
      server.on('error', (error) => {
        console.error('Server error:', error);
        reject(error);
      });

      server.listen(port, async () => {
        const baseUrl = `http://localhost:${port}`;
        console.log(`Test server started on ${baseUrl}`);

        // Test server connection
        try {
          const response = await fetch(`${baseUrl}/test`);
          if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
          }
          console.log('Server verification successful');
        } catch (error) {
          console.error('Server verification failed:', error);
          reject(error);
          return;
        }

        resolve({
          app,
          server,
          baseUrl,
          io: socketServer
        });
      });
    });
  } catch (error) {
    console.error('Setup error:', error);
    await teardownTestServer();
    throw error;
  }
}

async function teardownTestServer() {
  try {
    if (socketServer) {
      await new Promise(resolve => socketServer.close(resolve));
    }
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

module.exports = {
  setupTestServer,
  teardownTestServer
}; 