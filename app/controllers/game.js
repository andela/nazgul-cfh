import mongoose from 'mongoose';

const GameHistory = mongoose.model('GameHistory');

/* Save Game History */

/**
 * @class Game
 */
class Game {
/**
 * @static
 * @param {any} req JSON request
 * @param {any} res JSON response
 * @returns {any} any
 * @memberof Game
 */
  static gameHistory(req, res) {
    const { gameLog } = req.body;

    if (!gameLog) {
      return res.status(422).send({
        status: 'Unsuccessful',
        errors: 'No data supplied'
      });
    }
    const GameLog = new GameHistory({
      gameID: gameLog.gameId,
      gamePlayers: gameLog.players,
      gameRound: gameLog.rounds,
      gameWinner: gameLog.gameWinner.username,
      gameRounds: gameLog.rounds
    });

    GameLog.save((err) => {
      if (err) {
        return res.status(422).send({
          errors: err.errors
        });
      }
    });
  }
}

export default Game;
