const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

beforeAll(() => User.sync({ force: true }));
afterAll(() => User.drop());

test('Register new user', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test', email: 'test@test.com', password: 'pass123' });
  expect(res.statusCode).toBe(201);
  expect(res.body.token).toBeDefined();
});