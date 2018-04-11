
import supertest from 'supertest';
import { expect } from 'chai';
import mongoose from 'mongoose';
import app from '../../dist/server';

const request = supertest.agent(app);

// mongoose.connection.db.dropDatabase();
after((done) => {
  mongoose.connection.db.dropDatabase(done);
});
const gameLog = {
  gameId: 1,
  players: ['Tolu', 'Felix', 'Efosa', 'Faith'],
  rounds: 7,
  gameWinner: 'Felix'
};

describe('TEST FOR SAVING GAME HISTORY', () => {
  it('should return "No data supplied" when no game data' +
  ' is sent after game ends', (done) => {
    request
      .post(`/api/games/${gameLog.gameId}/start`)
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(422);
        expect(res.body.status).to.equal('Unsuccessful');
        expect(res.body.errors).to.equal('No data supplied');
        done();
      });
  });
  it('should return "Game history successfully saved"' +
  ' when game data is received and saved to the DB', (done) => {
    request
      .post(`/api/games/${gameLog.gameId}/start`)
      .send({
        gameLog: gameLog
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.status).to.equal('Successful');
        expect(res.body.message).to.equal('Game history successfully saved');
        done();
      });
  });
});

