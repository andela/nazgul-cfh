import supertest from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../../dist/server';
const request = supertest.agent(app);
console.log(process.env.NODE_ENV);
console.log()

// mongoose.connection.db.dropDatabase();
after((done) => {
  mongoose.connection.db.dropDatabase(done);
});

describe('Signup', () => {
  it('should not allow a user to sign up with no name', (done) => {
    request
      .post('/api/auth/signup')
      .set('Content-Type', 'application/json')
      .send({
        name: '',
        email: 'test@yahoo.com',
        password: 'test',
      })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error).to.equal('All fields are required');
        done();
      });
  });

  it('should not allow a user to sign up with no email', (done) => {
    request
      .post('/api/auth/signup')
      .set('Content-Type', 'application/json')
      .send({
        name: 'test',
        email: '',
        password: 'test',
      })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error).to.equal('All fields are required');
        done();
      });
  });

  it('should not allow a user to sign up with no email', (done) => {
    request
      .post('/api/auth/signup')
      .set('Content-Type', 'application/json')
      .send({
        name: 'test',
        email: '',
        password: 'test',
      })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error).to.equal('All fields are required');
        done();
      });
  });

  it('should not allow a user to sign up with no password', (done) => {
    request
      .post('/api/auth/signup')
      .set('Content-Type', 'application/json')
      .send({
        name: 'test',
        email: 'test@yahoo.com',
        password: '',
      })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error).to.equal('All fields are required');
        done();
      });
  });

  it('should not allow a user to sign up with no password', (done) => {
    request
      .post('/api/auth/signup')
      .set('Content-Type', 'application/json')
      .send({
        name: 'test',
        email: 'test@yahoo.com',
        password: '',
      })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error).to.equal('All fields are required');
        done();
      });
  });
});

describe('Signup API', () => {
  it('should get token on successful sign up', (done) => {
    request
      .post('/api/auth/signup')
      .set('Content-Type', 'application/json')
      .send({
        name: 'Full name',
        email: 'testtt@test.com',
        username: 'user',
        password: 'password'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(err).to.be.null;
        expect(res.body).to.be.an('object');
        done();
      });
  });
});

describe('POST /api/search/users', () => {
  const searchQuery = {
    emailOrUsernameOfFriend: 'testtt@test.com',
  };
  it('performs a retrieval if email is passed', (done) => {
    request
      .post('/api/search/users')
      .set('Content-Type', 'application/json')
      .send(searchQuery)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        console.log(res.body), 'jdhJHSGSGGSG'
        expect(res.body.user.email).to.equal('efosaokpugie@gmail.com')
      });
  });
  it('performs a retrieval if username is sent', (done) => {
    searchQuery.emailOrUsernameOfFriend = 'Full name';
    request
      .post('/api/search/users')
      .set('Content-Type', 'application/json')
      .send(searchQuery)
      .expect(200, done)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.user.name).to.equal('full name');
      });
  });
});
