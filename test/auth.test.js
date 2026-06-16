import chai from 'chai';
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';

const { expect } = chai;

describe('Auth', () => {
  before(async () => {
    await User.deleteMany({});
  });

  it('should register and login', async () => {
    const res = await request(app).post('/api/auth/register').send({ username: 'testuser', password: 'secret' });
    expect(res.status).to.equal(201);

    const login = await request(app).post('/api/auth/login').send({ username: 'testuser', password: 'secret' });
    expect(login.status).to.equal(200);
    expect(login.body.token).to.exist;
  });
});
