/**
 * Module dependencies.
 */
// const should = require('should');
const app = require('../../server');
const mongoose = require('mongoose');

const User = mongoose.model('User');

mongoose.Promise = global.Promise;

// Globals
let user;

// The tests
describe('<Unit Test>', () => {
  describe('Model User:', () => {
    before((done) => {
      user = new User({
        name: 'Full name',
        email: 'test@test.com',
        username: 'user',
        password: 'password'
      });

      done();
    });

    describe('Method Save', () => {
      it('should be able to save without problems', (done) => {
        user.save().then(() => done());
      });

      it('should be able to show an error when try to save without name', (done) => {
        user.name = '';
        user.save().catch(() => done());
      });
    });

    after((done) => {
      done();
    });
  });
});
