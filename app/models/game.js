/* eslint-disable import/extensions, import/no-unresolved */
import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * Game Schema
 */
const gameSchema = new Schema(
  {
    gameID: String,
    gamePlayers: [],
    gameRound: Number,
    gameWinner: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

mongoose.model('GameHistory', gameSchema);
