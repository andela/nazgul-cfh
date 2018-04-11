import supertest from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../../dist/server';
const request = supertest.agent(app);
console.log(process.env.NODE_ENV);

let token;
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
        email: 'tester@test.com',
        username: 'user_test',
        password: 'password'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        token = res.body.token;
        done();
      });
  });
});

describe('POST /api/search/users', () => {
  const searchQuery = {
    emailOrUsernameOfFriend: 'tester@test.com',
  };
  it('returns an error message if user is not authenticated', (done) => {
    request
      .post('/api/search/users')
      .set('Content-Type', 'application/json')
      .send(searchQuery)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal('You have to login First')
        done();
      });
  });
});
describe('POST /api/invite/users', () => {
  const searchQuery = {
    emailOrUsernameOfFriend: 'tester@test.com',
    link: 'localhost:3000/#!/app?game=83747mdbbf',
  };
  it('returns an error message if user is not authenticated', (done) => {
    request
      .post('/api/invite/users')
      .set('Content-Type', 'application/json')
      .send(searchQuery)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.error).to.equal('You have to login First');
        done();
      });
  });
});
// it('performs a retrieval if username is sent', (done) => {
//   const searchQuery = {
//     emailOrUsernameOfFriend: 'user_test',
//   };
//   request
//     .post('/api/search/users')
//     .set('Content-Type', 'application/json')
//     .set('authorization', token)
//     .send(searchQuery)
//     .end((err, res) => {
//       expect(res.status).to.equal(200);
//       expect(res.body.message).to.equal('full name');
//       done();
//     });
// });

describe('Signin', () => {
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
