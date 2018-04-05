import app from '../../server';

const chai = require('chai');

const { expect } = chai;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const request = chai.request(app);

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
        expect(res).to.have.status(400);
        expect(error).to.equal('All fields are required');
        done();
      });
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
      expect(res).to.have.status(400);
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
      expect(res).to.have.status(400);
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
      expect(res).to.have.status(400);
      expect(error).to.equal('All fields are required');
      done();
    });
});
