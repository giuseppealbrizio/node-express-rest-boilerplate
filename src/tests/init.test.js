import 'core-js/stable';
import 'regenerator-runtime/runtime';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';

// Connect to MongoDB
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

// Describe the test suite
describe(`GET /api/v1/${process.env.SERVICE_NAME}`, () => {
  test('should return 200 OK', async () => {
    const res = await request(app).get('/api/v1/rest_service_name');
    expect(res.statusCode).toEqual(200);
  });
});

// Disconnect from MongoDB
afterAll(async () => {
  await mongoose.disconnect();
});
