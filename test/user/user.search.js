const request = require('supertest');
const app = require('../../server');
const { expect } = require('chai');

describe('POST /api/search/users', () => {
  const searchQuery = {
    emailOrUsernameOfFriend: 'efosaokpugie@gmail.com'
  };
  it('performs a retrieval if email is passed', (done) => {
    request(app)
      .post('/api/search/users')
      .send(searchQuery)
      .expect(200, done)
      .expect((res) => {
        expect(res.body.user.email).to.equal('efosaokpugie@gmail.com');
      });
  });
  it('performs a retrieval if username is sent', (done) => {
    searchQuery.emailOrUsernameOfFriend = 'efosa';
    request(app)
      .post('/api/search/users')
      .send(searchQuery)
      .expect(200, done)
      .expect((res) => {
        expect(res.body.user.email).to.equal('efosaokpugie@gmail.com');
      });
  });
});
