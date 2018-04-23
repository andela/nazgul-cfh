angular.module('mean.system').controller('GameController', [
  '$scope',
  'game',
  '$timeout',
  '$location',
  'MakeAWishFactsService',
  '$dialog',
  function ($scope, game, $timeout, $location, MakeAWishFactsService, $dialog) {
    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.showTable = false;
    $scope.modalShown = false;
    $scope.game = game;
    $scope.pickedCards = [];
    $scope.hopscotch = hopscotch;
    let makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    $scope.makeAWishFact = makeAWishFacts.pop();

    $scope.startTour = () => {
      $scope.hopscotch.startTour(
        {
          id: 'hello-hopscotch',
          steps: [
            {
              content:
                '<h3>Welcome to Card for Humanity Game Screen!</h3><p>Here is a <b>quick tour</b> to get you started.</p>',
              target: document.getElementById('cards-container'),
              placement: 'top',
              width: $(document).width() < 400 ? 250 : 300
            },
            {
              title: 'User Pane',
              content:
                '<p>This is the <b>user’s pane</b>. It contains the player’s name and score for this gaming session.</p>',
              target: document.querySelector('#social-bar-container'),
              placement: $(document).width() < 400 ? 'top' : 'left',
              width: 300
            },
            {
              title: 'Start Game',
              content:
                '<p>You can click on <b>Start Game</b> here when more than two players have joined the game.</p>',
              target: document.querySelector('#question-container-outer'),
              placement: 'bottom'
            },
            {
              title: 'Rounds Timer',
              content:
                '<p>Each round takes <b>20 seconds</b>. This pane shows the countdown to each round.</p>',
              target: document.querySelector('timer'),
              placement: $(document).width() < 400 ? 'bottom' : 'right'
            },
            {
              title: 'The Card Czar',
              content:
                '<p>The <b>Card Czar</b> will be picked randomly to decide the appropriate answer to the blank question and whoever played that card wins the round.</p><p>You have to win more rounds to be the winner of this gaming session.</p>',
              target: document.getElementById('info-container'),
              placement: 'top',
              xOffset: $(document).width() < 400 ? 0 : 200,
              width: $(document).width() < 400 ? 250 : 350
            },
            {
              title: 'Chat With Players',
              content:
                '<p>You can also chat with everybody in this gaming session<p><p>Just click this button.</p>',
              target: document.getElementById('info-container'),
              placement: 'top',
              xOffset: $(document).width() < 400 ? 0 : 400,
              width: $(document).width() < 400 ? 250 : 400
            },
            {
              title: 'You are the Czar',
              content:
                '<p>You will be notified here when you have to be <b>the Card Czar</b></p>',
              target: document.getElementById('info-container'),
              placement: $(document).width() < 400 ? 'bottom' : 'right',
              width: 250
            },
            {
              title: 'Abandon Game',
              content:
                '<p>You can abandon this game session at any time by clicking this button.</p>',
              target: document.querySelector($(document).width() < 400 ? '.material-icons' : '.abandon-game'),
              placement: $(document).width() < 400 ? 'bottom' : 'left'
            },
            {
              title: 'Take Tour Any time',
              content:
                '<p>You can take this tour anytime by clicking this button</p>',
              target: document.querySelector($(document).width() < 400 ? '.material-icons' : '.taketour'),
              placement: $(document).width() < 400 ? 'bottom' : 'left'
            },
            {
              title: 'Have Fun',
              content: '<p>We hope you enjoy the game as we do.</p>',
              target: document.getElementById('info-container'),
              placement: 'top',
              width: 250
            }
          ]
        },
        0
      );
    };
    angular.element(document).ready(() => {
      if (localStorage.getItem('tour-taken')) return;
      const interval = setInterval(() => {
        if (document.getElementById('cards-container') != null) {
          $scope.startTour();
          localStorage.setItem('tour-taken', true);
          clearInterval(interval);
        }
      }, 1000);
    });

    $scope.pickCard = function (card) {
      if (!$scope.hasPickedCards) {
        if ($scope.pickedCards.indexOf(card.id) < 0) {
          $scope.pickedCards.push(card.id);
          if (game.curQuestion.numAnswers === 1) {
            $scope.sendPickedCards();
            $scope.hasPickedCards = true;
          } else if (
            game.curQuestion.numAnswers === 2 &&
            $scope.pickedCards.length === 2
          ) {
            // delay and send
            $scope.hasPickedCards = true;
            $timeout($scope.sendPickedCards, 300);
          }
        } else {
          $scope.pickedCards.pop();
        }
      }
    };

    $scope.pointerCursorStyle = function () {
      if (
        $scope.isCzar() &&
        $scope.game.state === 'waiting for czar to decide'
      ) {
        return { cursor: 'pointer' };
      }
      return {};
    };

    $scope.sendPickedCards = function () {
      game.pickCards($scope.pickedCards);
      $scope.showTable = true;
    };

    $scope.cardIsFirstSelected = function (card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[0];
      }
      return false;
    };

    $scope.cardIsSecondSelected = function (card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[1];
      }
      return false;
    };

    $scope.firstAnswer = function ($index) {
      if ($index % 2 === 0 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.secondAnswer = function ($index) {
      if ($index % 2 === 1 && game.curQuestion.numAnswers > 1) {
        return true;
      }
      return false;
    };

    $scope.showFirst = function (card) {
      return (
        game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id
      );
    };

    $scope.showSecond = function (card) {
      return (
        game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id
      );
    };

    $scope.isCzar = function () {
      return game.czar === game.playerIndex;
    };

    $scope.isPlayer = function ($index) {
      return $index === game.playerIndex;
    };

    $scope.isCustomGame = function () {
      return !/^\d+$/.test(game.gameID) && game.state === 'awaiting players';
    };

    $scope.isPremium = function ($index) {
      return game.players[$index].premium;
    };

    $scope.currentCzar = function ($index) {
      return $index === game.czar;
    };

    $scope.winningColor = function ($index) {
      if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
        return $scope.colors[game.players[game.winningCardPlayer].color];
      }
      return '#f9f9f9';
    };

    $scope.pickWinning = function (winningSet) {
      if ($scope.isCzar()) {
        game.pickWinning(winningSet.card[0]);
        $scope.winningCardPicked = true;
      }
    };

    $scope.winnerPicked = function () {
      return game.winningCard !== -1;
    };

    $scope.startGame = function () {
      game.startGame();
    };

    $scope.abandonGame = function () {
      game.leaveGame();
      $location.path('/');
    };

    // Catches changes to round to update when no players pick card
    // (because game.state remains the same)
    $scope.$watch('game.round', () => {
      $scope.hasPickedCards = false;
      $scope.showTable = false;
      $scope.winningCardPicked = false;
      $scope.makeAWishFact = makeAWishFacts.pop();
      if (!makeAWishFacts.length) {
        makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
      }
      $scope.pickedCards = [];
    });

    // In case player doesn't pick a card in time, show the table
    $scope.$watch('game.state', () => {
      if (
        game.state === 'waiting for czar to decide' &&
        $scope.showTable === false
      ) {
        $scope.showTable = true;
      }
    });

    $scope.$watch('game.gameID', () => {
      if (game.gameID && game.state === 'awaiting players') {
        if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
          $location.search({});
        } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.
          $location.search({ game: game.gameID });
          if (!$scope.modalShown) {
            setTimeout(() => {
              const link = document.URL;
              const txt =
                'Give the following link to your friends so they can join your game: ';
              $('#lobby-how-to-play').text(txt);
              $('#oh-el')
                .css({
                  'text-align': 'center',
                  'font-size': '22px',
                  background: 'white',
                  color: 'black'
                })
                .text(link);
            }, 200);
            $scope.modalShown = true;
          }
        }
      }
    });

    if ($location.search().game && !/^\d+$/.test($location.search().game)) {
      console.log('joining custom game');
      game.joinGame('joinGame', $location.search().game);
    } else if ($location.search().custom) {
      game.joinGame('joinGame', null, true);
    } else {
      game.joinGame();
    }
  }
]);
