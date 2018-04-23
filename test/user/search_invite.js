import supertest from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../../dist/server';

const request = supertest.agent(app);
let firstUserToken;
describe('POST /api/search/users', () => {
  it('sign up a user first', (done) => {
    request
      .post('/api/auth/signup')
      .set('Content-Type', 'application/json')
      .send({
        name: 'efosa',
        email: 'test@yahoo.com',
        password: 'test',
        username: 'efosky',
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        firstUserToken = res.body.token;
        done();
      });
  });
  const searchQuery = {
    search: 'test@yahoo.com'
  };
  it('returns an error message if user is not authenticated', (done) => {
    request
      .post('/api/search/users')
      .set('Content-Type', 'application/json')
      .send(searchQuery)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.error).to.equal('You have to login First');
        done();
      });
  });
  it('returns an error message if user searches for himself', (done) => {
    request
      .post('/api/search/users')
      .set('x-access-token', firstUserToken)
      .send(searchQuery)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('You cannot search for yourself');
        done();
      });
  });
  it('returns a message if no user is found', (done) => {
    searchQuery.search = 'tester@jfhf.com';
    request
      .post('/api/search/users')
      .set('x-access-token', firstUserToken)
      .send(searchQuery)
      .end((err, res) => {
        expect(res.body.message).to.equal('No friends found');
        done();
      });
  });
  it('performs a search with username', (done) => {
    searchQuery.search = 'efosky';
    request
      .post('/api/search/users')
      .set('x-access-token', firstUserToken)
      .send(searchQuery)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.user.username).to.equal('efosky');
        done();
      });
  });
  it('performs a search with email', (done) => {
    request
      .post('/api/search/users')
      .set('x-access-token', firstUserToken)
      .send(searchQuery)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.user.email).to.equal('test@yahoo.com');
        done();
      });
  });
});

describe('POST /api/invite/users', () => {
  const inviteReceipt = {
    emailOfUsernameOfFriend: 'efosaokpugie@gmail.com',
    link: 'localhost:3000/#!/app?game=83747mdbbf',
  };
  it('returns an error message if user is not authenticated', (done) => {
    request
      .post('/api/invite/users')
      .send(inviteReceipt)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
  });
});

// mongoose.connection.db.dropDatabase();
after((done) => {
  mongoose.connection.db.dropDatabase(done);
});
