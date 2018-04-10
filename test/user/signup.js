
import supertest from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../../dist/server';

const request = supertest.agent(app);

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

