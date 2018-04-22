var Game = require('./game');
var Player = require('./player');
require("console-stamp")(console, "m/dd HH:MM:ss");
var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jsonwebtoken');
require('dotenv').config();

var avatars = require(__dirname + '/../../app/controllers/avatars.js').all();
// Valid characters to use to generate random private game IDs
var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";

module.exports = function(io) {

  var game;
  var allGames = {};
  var allPlayers = {};
  var gamesNeedingPlayers = [];
  var gameID = 0;

  io.sockets.on('connection', function (socket) {
    console.log(socket.id +  ' Connected');
    socket.emit('id', {id: socket.id});

    socket.on('pickCards', function(data) {
      console.log(socket.id,"picked",data);
      if (allGames[socket.gameID]) {
        allGames[socket.gameID].pickCards(data.cards,socket.id);
      } else {
        console.log('Received pickCard from',socket.id, 'but game does not appear to exist!');
      }
    });

    socket.on('pickWinning', function(data) {
      if (allGames[socket.gameID]) {
        allGames[socket.gameID].pickWinning(data.card,socket.id);
      } else {
        console.log('Received pickWinning from',socket.id, 'but game does not appear to exist!');
      }
    });

    socket.on('joinGame', function(data) {
      if (!allPlayers[socket.id]) {
        joinGame(socket,data);
      }
    });

    socket.on('joinNewGame', function(data) {
      exitGame(socket);
      joinGame(socket,data);
    });

    socket.on('startGame', function() {
      if (allGames[socket.gameID]) {
        var thisGame = allGames[socket.gameID];
        if (thisGame.players.length >= thisGame.playerMinLimit) {
          // Remove this game from gamesNeedingPlayers so new players can't join it.
          gamesNeedingPlayers.forEach(function(game,index) {
            if (game.gameID === socket.gameID) {
              return gamesNeedingPlayers.splice(index,1);
            }
          });
          thisGame.prepareGame();
          thisGame.sendNotification('The game has begun!');
        }
      }
    });

    socket.on('leaveGame', function() {
      exitGame(socket);
    });

    socket.on('disconnect', function(){
      console.log('Rooms on Disconnect ', io.sockets.manager.rooms);
      exitGame(socket);
    });
  });

  var joinGame = function(socket,data) {
    var player = new Player(socket);
    data = data || {};
    if (data.token !== 'unauthenticated') {
      var payload = jwt.decode(data.token, process.env.SECRET);
      User.findOne({
        _id: payload._id
      }).exec(function(err, user) {
        if (err) {
          console.log('err',err);
          return err; // Hopefully this never happens.
        }
        if (!user) {
          // If the user's ID isn't found (rare)
          player.username = 'Guest';
          player.avatar = avatars[Math.floor(Math.random()*4)+12];
        } else {
          player.username = user.username || user.name
          player.redirectToNewGame = false;
          player.premium = user.premium || 0;
          player.avatar = user.avatar || avatars[Math.floor(Math.random()*4)+12];
        }
        getGame(player,socket,data.region,data.room,data.createPrivate);
      });
    } else {
      // If the user isn't authenticated (guest)
      player.username = 'Guest';
      player.avatar = avatars[Math.floor(Math.random()*4)+12];
      getGame(player,socket,data.region,data.room,data.createPrivate);
    }
  };

  var getGame = function(player,socket,region,requestedGameId,createPrivate) {
    requestedGameId = requestedGameId || '';
    createPrivate = createPrivate || false;
    console.log(socket.id,'is requesting room',requestedGameId);
    if (requestedGameId.length && allGames[requestedGameId]) {
      console.log('Room',requestedGameId,'is valid');
      var game = allGames[requestedGameId];
      // Ensure that the same socket doesn't try to join the same game
      // This can happen because we rewrite the browser's URL to reflect
      // the new game ID, causing the view to reload.
      // Also checking the number of players, so node doesn't crash when
      // no one is in this custom room.
      if (game.state === 'awaiting players' && (!game.players.length ||
        game.players[0].socket.id !== socket.id)) {
        // Put player into the requested game
        console.log('Allowing player to join',requestedGameId);
        allPlayers[socket.id] = true;
        game.players.push(player);
        socket.join(game.gameID);
        socket.gameID = game.gameID;
        game.assignPlayerColors();
        game.assignGuestNames();
        game.sendUpdate();
        game.sendNotification(player.username+' has joined the game!');
        if (game.players.length === game.playerMaxLimit) {
          gamesNeedingPlayers.shift();
          game.prepareGame();
        }
      } else {
        socket.emit('maxPlayersReached');
      }
    } else {
      // Put players into the general queue
      console.log('Redirecting player',socket.id,'to general queue');
      if (createPrivate) {
        createGameWithFriends(player,socket,region);
      } else {
        fireGame(player,socket,region);
      }
    }
  };

  var fireGame = function(player,socket,region) {
    let game = undefined;
    let index = 0;
    gamesNeedingPlayers.map((thisGame, thisGameIndex) => {
      if (thisGame.region === region) {
        if(!game) {
          game = thisGame;
          index = thisGameIndex;
        }
      }
    })
    if (!game) {
      gameID += 1;
      var gameIDStr = gameID.toString();
      game = new Game(gameIDStr, io, region);
      allPlayers[socket.id] = true;
      game.players.push(player);
      allGames[gameID] = game;
      gamesNeedingPlayers.push(game);
      socket.join(game.gameID);
      socket.gameID = game.gameID;
      console.log(socket.id,'has joined newly created game',game.gameID);
      game.assignPlayerColors();
      game.assignGuestNames();
      game.sendUpdate();
    } else {
      allPlayers[socket.id] = true;
      game.players.push(player);
      console.log(socket.id,'has joined game',game.gameID);
      socket.join(game.gameID);
      socket.gameID = game.gameID;
      game.assignPlayerColors();
      game.assignGuestNames();
      game.sendUpdate();
      game.sendNotification(player.username+' has joined the game!');
      if (game.players.length >= game.playerMaxLimit) {
        gamesNeedingPlayers.splice(index, 1);
        game.prepareGame();
      }
    }
  };

  var createGameWithFriends = function(player,socket, region) {
    var isUniqueRoom = false;
    var uniqueRoom = '';
    // Generate a random 6-character game ID
    while (!isUniqueRoom) {
      uniqueRoom = '';
      for (var i = 0; i < 6; i++) {
        uniqueRoom += chars[Math.floor(Math.random()*chars.length)];
      }
      if (!allGames[uniqueRoom] && !(/^\d+$/).test(uniqueRoom)) {
        isUniqueRoom = true;
      }
    }
    console.log(socket.id,'has created unique game',uniqueRoom);
    var game = new Game(uniqueRoom,io, region);
    allPlayers[socket.id] = true;
    game.players.push(player);
    allGames[uniqueRoom] = game;
    socket.join(game.gameID);
    socket.gameID = game.gameID;
    game.assignPlayerColors();
    game.assignGuestNames();
    game.sendUpdate();
  };

  var exitGame = function(socket) {
    console.log(socket.id,'has disconnected');
    if (allGames[socket.gameID]) { // Make sure game exists
      var game = allGames[socket.gameID];
      console.log(socket.id,'has left game',game.gameID);
      delete allPlayers[socket.id];
      if (game.state === 'awaiting players' ||
        game.players.length-1 >= game.playerMinLimit) {
        game.removePlayer(socket.id);
      } else {
        game.stateDissolveGame();
        for (var j = 0; j < game.players.length; j++) {
          game.players[j].socket.leave(socket.gameID);
        }
        game.killGame();
        delete allGames[socket.gameID];
      }
    }
    socket.leave(socket.gameID);
  };
};
