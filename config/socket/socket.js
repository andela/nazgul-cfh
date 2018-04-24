const Game = require('./game');
const Player = require('./player');
require('console-stamp')(console, 'm/dd HH:MM:ss');
const mongoose = require('mongoose');

const User = mongoose.model('User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const avatars = require(`${__dirname}/../../app/controllers/avatars.js`).all();
const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';

module.exports = function (io) {
  const allGames = {};
  const allPlayers = {};
  const gamesNeedingPlayers = [];
  let gameID = 0;

  const fireGame = function (player, socket, region) {
    let game;
    let index = 0;
    gamesNeedingPlayers.map((thisGame, thisGameIndex) => {
      if (thisGame.region === region) {
        if (!game) {
          game = thisGame;
          index = thisGameIndex;
        }
      }
    });
    if (!game) {
      gameID += 1;
      const gameIDStr = gameID.toString();
      game = new Game(gameIDStr, io, region);
      allPlayers[socket.id] = true;
      game.players.push(player);
      allGames[gameID] = game;
      gamesNeedingPlayers.push(game);
      socket.join(game.gameID);
      socket.gameID = game.gameID;
      game.assignPlayerColors();
      game.assignGuestNames();
      game.sendUpdate();
    } else {
      allPlayers[socket.id] = true;
      game.players.push(player);
      socket.join(game.gameID);
      socket.gameID = game.gameID;
      game.assignPlayerColors();
      game.assignGuestNames();
      game.sendUpdate();
      game.sendNotification(`${player.username} has joined the game!`);
      if (game.players.length >= game.playerMaxLimit) {
        gamesNeedingPlayers.splice(index, 1);
        game.prepareGame();
      }
    }
  };

  const createGameWithFriends = function (player, socket, region) {
    let isUniqueRoom = false;
    let uniqueRoom = '';
    // Generate a random 6-character game ID
    while (!isUniqueRoom) {
      uniqueRoom = '';
      for (let i = 0; i < 6; i += 1) {
        uniqueRoom += chars[Math.floor(Math.random() * chars.length)];
      }
      if (!allGames[uniqueRoom] && !/^\d+$/.test(uniqueRoom)) {
        isUniqueRoom = true;
      }
    }
    const game = new Game(uniqueRoom, io, region);
    allPlayers[socket.id] = true;
    game.players.push(player);
    allGames[uniqueRoom] = game;
    socket.join(game.gameID);
    socket.gameID = game.gameID;
    game.assignPlayerColors();
    game.assignGuestNames();
    game.sendUpdate();
  };

  const getGame = function (
    player,
    socket,
    region,
    requestedGameId,
    createPrivate
  ) {
    requestedGameId = requestedGameId || '';
    createPrivate = createPrivate || false;
    if (requestedGameId.length && allGames[requestedGameId]) {
      const game = allGames[requestedGameId];
      // Ensure that the same socket doesn't try to join the same game
      // This can happen because we rewrite the browser's URL to reflect
      // the new game ID, causing the view to reload.
      // Also checking the number of players, so node doesn't crash when
      // no one is in this custom room.
      if (
        game.state === 'awaiting players' &&
        (!game.players.length || game.players[0].socket.id !== socket.id) &&
        game.players.length < game.playerMaxLimit
      ) {
        // Put player into the requested game
        allPlayers[socket.id] = true;
        game.players.push(player);
        socket.join(game.gameID);
        socket.gameID = game.gameID;
        game.assignPlayerColors();
        game.assignGuestNames();
        game.sendUpdate();
        game.sendNotification(`${player.username} has joined the game!`);
        if (game.players.length === game.playerMaxLimit) {
          gamesNeedingPlayers.shift();
          game.prepareGame();
        }
      } else {
        socket.emit('maxPlayersReached');
      }
    } else {
      // Put players into the general queue
      console.log('Redirecting player', socket.id, 'to general queue');
      if (createPrivate) {
        createGameWithFriends(player, socket, region);
      } else {
        fireGame(player, socket, region);
      }
    }
  };

  const joinGame = function (socket, data) {
    const player = new Player(socket);
    data = data || {};
    if (data.token !== 'unauthenticated') {
      const payload = jwt.decode(data.token, process.env.SECRET);
      User.findOne({
        _id: payload._id
      }).exec((err, user) => {
        if (err) {
          return err; // Hopefully this never happens.
        }
        if (!user) {
          // If the user's ID isn't found (rare)
          player.username = 'Guest';
          player.avatar = avatars[Math.floor(Math.random() * 4) + 12];
        } else {
          player.username = user.username || user.name;
          player.redirectToNewGame = false;
          player.premium = user.premium || 0;
          player.avatar =
            user.avatar || avatars[Math.floor(Math.random() * 4) + 12];
        }
        getGame(player, socket, data.region, data.room, data.createPrivate);
      });
    } else {
      // If the user isn't authenticated (guest)
      player.username = 'Guest';
      player.avatar = avatars[Math.floor(Math.random() * 4) + 12];
      getGame(player, socket, data.region, data.room, data.createPrivate);
    }
  };

  const exitGame = function (socket) {
    if (allGames[socket.gameID]) {
      // Make sure game exists
      const game = allGames[socket.gameID];
      delete allPlayers[socket.id];
      if (
        game.state === 'awaiting players' ||
        game.players.length - 1 >= game.playerMinLimit
      ) {
        game.removePlayer(socket.id);
      } else {
        game.stateDissolveGame();
        for (let j = 0; j < game.players.length; j += 1) {
          game.players[j].socket.leave(socket.gameID);
        }
        game.killGame();
        delete allGames[socket.gameID];
      }
    }
    socket.leave(socket.gameID);
  };

  io.sockets.on('connection', (socket) => {
    socket.emit('id', { id: socket.id });

    socket.on('pickCards', (data) => {
      if (allGames[socket.gameID]) {
        allGames[socket.gameID].pickCards(data.cards, socket.id);
      }
    });

    socket.on('pickWinning', (data) => {
      if (allGames[socket.gameID]) {
        allGames[socket.gameID].pickWinning(data.card, socket.id);
      }
    });

    socket.on('joinGame', (data) => {
      if (!allPlayers[socket.id]) {
        joinGame(socket, data);
      }
    });

    socket.on('joinNewGame', (data) => {
      exitGame(socket);
      joinGame(socket, data);
    });

    socket.on('startGame', () => {
      if (allGames[socket.gameID]) {
        const thisGame = allGames[socket.gameID];
        if (thisGame.players.length >= thisGame.playerMinLimit) {
          gamesNeedingPlayers.forEach((game, index) => {
            if (game.gameID === socket.gameID) {
              return gamesNeedingPlayers.splice(index, 1);
            }
          });
          thisGame.prepareGame();
          thisGame.sendNotification('The game has begun!');
        }
      }
    });

    socket.on('leaveGame', () => {
      exitGame(socket);
    });

    socket.on('disconnect', () => {
      exitGame(socket);
    });
  });
};
