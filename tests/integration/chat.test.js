const request = require('supertest');
const app = require('../../index');
const mongoose = require('mongoose');
const { createTestUser, createTestToken } = require('../helpers');

describe('Chat API Integration Tests', () => {
  let token;
  let user;

  beforeAll(async () => {
    user = await createTestUser();
    token = createTestToken(user);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    it('should login existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('Chat Rooms', () => {
    it('should create a new room', async () => {
      const res = await request(app)
        .post('/api/rooms')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Room',
          description: 'Test Description'
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
    });
  });
}); 