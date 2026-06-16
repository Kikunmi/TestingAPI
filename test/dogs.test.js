import chai from 'chai';
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import Dog from '../models/Dog.js';

const { expect } = chai;

describe('Dogs', () => {
  let token;

  before(async () => {
    await User.deleteMany({});
    await Dog.deleteMany({});
    await request(app).post('/api/auth/register').send({ username: 'owner', password: 'pass' });
    const login = await request(app).post('/api/auth/login').send({ username: 'owner', password: 'pass' });
    token = login.body.token;
  });

  it('should register a dog and list it', async () => {
    const res = await request(app).post('/api/dogs').set('Authorization', `Bearer ${token}`).send({ name: 'Rex', description: 'Friendly' });
    expect(res.status).to.equal(201);

    const list = await request(app).get('/api/dogs/registered').set('Authorization', `Bearer ${token}`);
    expect(list.status).to.equal(200);
    expect(list.body.dogs).to.have.lengthOf(1);
  });
});
