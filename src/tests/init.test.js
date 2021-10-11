import 'core-js/stable';
import 'regenerator-runtime/runtime';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

/**
 * This test describe how to login and how we pass the Bearer token to the server.
 */

describe('Initialization test', () => {
  it('Should initialize the app', async () => {
    const res = await request(app)
      .post('/api/v1/service')
      .send({ email: 'mail@mail.com', password: 'password' });

    token = res.body.token;

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toContain('success');
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('token');
  });

  it('Should return the user in the cookie', async () => {
    const res = await request(app)
      .get('/api/v1/auth/test-check-user-logged')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    // console.log(res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toContain('success');
  });
});

afterAll(async () => {
  await mongoose.disconnect(process.env.MONGO_URI_TEST);
});
