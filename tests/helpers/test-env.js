// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-123';
process.env.TEST_TIMEOUT = '30000';

// Increase Node's default timeout
require('http').globalAgent.maxSockets = 50;
require('http').globalAgent.keepAlive = true;
require('http').globalAgent.timeout = 30000;