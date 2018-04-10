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
        email: 'tester@test.com',
        username: 'user_test',
        password: 'password'
      })
      .end((err, res) => {
        console.log(res.body);
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });
  it('performs a retrieval if email is passed', (done) => {
    const searchQuery = {
      emailOrUsernameOfFriend: 'tester@test.com',
    };
    request
      .post('/api/search/users')
      .set('Content-Type', 'application/json')
      .send(searchQuery)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        console.log(res.body), 'jdhJHSGSGGSG'
        expect(res.body.user.email).to.equal('efosaokpugie@gmail.com')
        done();
      });
  });
});

describe('POST /api/search/users', () => {
  it('performs a retrieval if email is passed', (done) => {
    request
      .post('/api/search/users')
      .set('Content-Type', 'application/json')
      .send(searchQuery)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        console.log(res.body), 'jdhJHSGSGGSG'
        expect(res.body.user.email).to.equal('efosaokpugie@gmail.com')
        done();
      });
  });
  it('performs a retrieval if username is sent', (done) => {
    const searchQuery = {
      emailOrUsernameOfFriend: 'Full name',
    };
    request
      .post('/api/search/users')
      .set('Content-Type', 'application/json')
      .send(searchQuery)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.user.name).to.equal('full name');
        done();
      });
  });
});
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

