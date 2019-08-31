const request = require('supertest');
const server = require('../../api/server');
const db = require('../../database/dbConfig');

const LOGIN_ENDPOINT = '/api/auth/login';
const REGISTER_ENDPOINT = '/api/auth/register';

// POST /api/auth/login

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    const mockUser = { username: 'Dan', password: 'password123' };
    await request(server)
      .post(REGISTER_ENDPOINT)
      .send(mockUser);
  });

  describe('login failure: missing credentials', () => {
    test('should return HTTP status 400 with message', async () => {
      const missingCredsMsg = `username and password required`;
      const res = await request(server).post(LOGIN_ENDPOINT);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', missingCredsMsg);
    });
  });

  describe('login failure: invalid credentials', () => {
    test('should return HTTP status 401 with message', async () => {
      const invalidCredsMsg = 'The provided username and password do not match';
      const invalidCreds = {
        username: 'Dan',
        password: 'notthepassword'
      };
      const res = await request(server)
        .post(LOGIN_ENDPOINT)
        .send(invalidCreds);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', invalidCredsMsg);
    });
  });

  describe('login successful', () => {
    test('should return HTTP status 200', async () => {
      const validCredentials = { username: 'Dan', password: 'password123' };
      const res = await request(server)
        .post(LOGIN_ENDPOINT)
        .send(validCredentials);
      expect(res.status).toBe(200);
    });
  });
});

// POST /api/auth/register

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    await db('users').truncate();
  });

  describe('registration failure: missing arguments', () => {
    test('should return HTTP status 400 with message', async () => {
      const missingArgumentsMsg = 'username and password required!';
      const res = await request(server).post(REGISTER_ENDPOINT);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', missingArgumentsMsg);
    });
  });

  describe('user registration successful', () => {
    test('should return HTTP status 201', async () => {
      const mockUser = { username: 'Dan', password: 'password123' };
      const res = await request(server)
        .post(REGISTER_ENDPOINT)
        .send(mockUser);
      expect(res.status).toBe(201);
    });

    test('should return new user with hashed password', async () => {
      const mockUser = { username: 'Dan', password: 'password123' };
      const res = await request(server)
        .post(REGISTER_ENDPOINT)
        .send(mockUser);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty('username', mockUser.username);
      expect(res.body).toHaveProperty('password');
      expect(res.body).not.toHaveProperty('password', mockUser.password);
    });
  });
});
