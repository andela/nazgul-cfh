import supertest from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../../dist/server';

const request = supertest.agent(app);
// mongoose.connection.db.dropDatabase();
after((done) => {
  mongoose.connection.db.dropDatabase(done);
});


describe('POST api/auth/signup', () => {
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

  it('should get token on successful sign up', (done) => {
    request
      .post('/api/auth/signup')
      .set('Content-Type', 'application/json')
      .send({
        name: 'Full name',
        email: 'tester@test.com',
        username: 'user_test',
        password: 'password'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});

describe('POST api/auth/login', () => {
  it('should not allow a user to login with no email', (done) => {
    request
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        password: 'test',
      })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error).to.equal('All fields are required');
        done();
      });
  });

  it('should not allow a user to login with no password', (done) => {
    request
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'test@yahoo.com',
      })
      .end((err, res) => {
        const { error } = res.body;
        expect(res.status).to.equal(400);
        expect(error).to.equal('All fields are required');
        done();
      });
  });

  it('should not allow a user to login with empty email', (done) => {
    request
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
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

  it('should not allow a user to login with empty password', (done) => {
    request
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
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

  it('should get token on successful login', (done) => {
    request
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'tester@test.com',
        password: 'password'
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
