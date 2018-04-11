angular.module('mean.system')
.controller('GameController', ['$scope', 'game', '$timeout', '$location', 'MakeAWishFactsService', '$dialog', '$rootScope', '$http', function ($scope, game, $timeout, $location, MakeAWishFactsService, $dialog, $rootScope, $http ) {
    $scope.hasPickedCards = false;
    $scope.winningCardPicked = false;
    $scope.showTable = false;
    $scope.modalShown = false;
    $scope.game = game;
    $scope.pickedCards = [];
    var makeAWishFacts = MakeAWishFactsService.getMakeAWishFacts();
    $scope.makeAWishFact = makeAWishFacts.pop();
    $scope.isSearchingUser = false;
    $scope.isInvitingUser = false;
    $scope.foundUser = false;
    $scope.invitedUser = false;
    $scope.userDetails = {};
    
    $http.defaults.headers.common.Authorization = JSON.parse(localStorage.getItem('userData')).token;
    $scope.openSearchModal = () => {
      document.getElementById('myModal').style.display = 'block';
    }

    $scope.closeSearchModal = () => {
      document.getElementById('myModal').style.display = 'none';
    }
    
    $scope.closeCannotStartGameModal = () => {
      document.getElementById('cannot-start-game-modal').style.display = 'none';
    }

    $rootScope.$on('maxPlayersReached', () => {
      document.getElementById('game-already-started-modal').style.display = 'block';
    });

    $scope.searchUser = () => {
      $scope.isSearchingUser = true
      $http({
        method: 'POST',
        url: '/api/search/users',
        data: { search: $scope.emailOrUsernameOfFriend },
      })
      .then((res) => {
        if (!res.data.user) {
          $scope.foundUser = true;
          $scope.isSearchingUser = false;
          $scope.searchResult = 'No matching results';
          $scope.isSearchingUser = false;
          return $scope.searchResult;
        }
        $scope.isSearchingUser = false;
        $scope.foundUser = true;
        $scope.userDetails = res.data.user;
        $scope.searchResult = res.data.user.email;
        return $scope.searchResult;
      }, (err) => {
        $scope.isSearchingUser = false;
        $scope.foundUser = false;
        $scope.searchResult = 'oops, an error occured,please try again';
        $scope.userDetails = {};
        return $scope.searchResult;
      });
    };

    $scope.inviteUser = () => {
      $scope.isInvitingUser = true
      $http({
        method: 'POST',
        url: '/api/invite/users',
        data: { emailOfUserToBeInvited: $scope.userDetails.email, link: document.URL },
      })
      .then((res) => {
        $scope.isInvitingUser = false;
        $scope.invitedUser = true;
        $scope.searchResult = `${$scope.userDetails.name} has been invited to the game`;
        $scope.userDetails = {};
        return $scope.searchResult;
      }, (err) => {
        $scope.isInvitingUser = false;
        $scope.invitedUser = true;
        $scope.searchResult = 'oops, an error occured,please try again';
        $scope.userDetails = {};
        return $scope.searchResult;
      })
    };

    $scope.pickCard = function(card) {
      if (!$scope.hasPickedCards) {
        if ($scope.pickedCards.indexOf(card.id) < 0) {
          $scope.pickedCards.push(card.id);
          if (game.curQuestion.numAnswers === 1) {
            $scope.sendPickedCards();
            $scope.hasPickedCards = true;
          } else if (game.curQuestion.numAnswers === 2 &&
            $scope.pickedCards.length === 2) {
            //delay and send
            $scope.hasPickedCards = true;
            $timeout($scope.sendPickedCards, 300);
          }
        } else {
          $scope.pickedCards.pop();
        }
      }
    };

    $scope.pointerCursorStyle = function() {
      if ($scope.isCzar() && $scope.game.state === 'waiting for czar to decide') {
        return {'cursor': 'pointer'};
      } else {
        return {};
      }
    };

    $scope.sendPickedCards = function() {
      game.pickCards($scope.pickedCards);
      $scope.showTable = true;
    };

    $scope.cardIsFirstSelected = function(card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[0];
      } else {
        return false;
      }
    };

    $scope.cardIsSecondSelected = function(card) {
      if (game.curQuestion.numAnswers > 1) {
        return card === $scope.pickedCards[1];
      } else {
        return false;
      }
    };

    $scope.firstAnswer = function($index){
      if($index % 2 === 0 && game.curQuestion.numAnswers > 1){
        return true;
      } else{
        return false;
      }
    };

    $scope.secondAnswer = function($index){
      if($index % 2 === 1 && game.curQuestion.numAnswers > 1){
        return true;
      } else{
        return false;
      }
    };

    $scope.showFirst = function(card) {
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[0] === card.id;
    };

    $scope.showSecond = function(card) {
      return game.curQuestion.numAnswers > 1 && $scope.pickedCards[1] === card.id;
    };

    $scope.isCzar = function() {
      return game.czar === game.playerIndex;
    };

    $scope.isPlayer = function($index) {
      return $index === game.playerIndex;
    };

    $scope.isCustomGame = function() {
      return !(/^\d+$/).test(game.gameID) && game.state === 'awaiting players';
    };

    $scope.isPremium = function($index) {
      return game.players[$index].premium;
    };

    $scope.currentCzar = function($index) {
      return $index === game.czar;
    };

    $scope.winningColor = function($index) {
      if (game.winningCardPlayer !== -1 && $index === game.winningCard) {
        return $scope.colors[game.players[game.winningCardPlayer].color];
      } else {
        return '#f9f9f9';
      }
    };

    $scope.pickWinning = function(winningSet) {
      if ($scope.isCzar()) {
        game.pickWinning(winningSet.card[0]);
        $scope.winningCardPicked = true;
      }
    };

    $scope.winnerPicked = function() {
      return game.winningCard !== -1;
    };

    $scope.startGame = function() {
      if (game.players.length < 3) {
        document.getElementById('cannot-start-game-modal').style.display = 'block';
      } else {
        game.startGame();
      }
    };

    $scope.abandonGame = function() {
      game.leaveGame();
      $location.path('/');
    };

    // Catches changes to round to update when no players pick card
    // (because game.state remains the same)
    $scope.$watch('game.round', function() {
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
    $scope.$watch('game.state', function() {
      if (game.state === 'waiting for czar to decide' && $scope.showTable === false) {
        $scope.showTable = true;
      }
    });

    $scope.$watch('game.gameID', function() {
      if (game.gameID && game.state === 'awaiting players') {
        if (!$scope.isCustomGame() && $location.search().game) {
          // If the player didn't successfully enter the request room,
          // reset the URL so they don't think they're in the requested room.
          $location.search({});
        } else if ($scope.isCustomGame() && !$location.search().game) {
          // Once the game ID is set, update the URL if this is a game with friends,
          // where the link is meant to be shared.
          $location.search({game: game.gameID});
        }
      }
    });

    if ($location.search().game && !(/^\d+$/).test($location.search().game)) {
      console.log('joining custom game');
      game.joinGame('joinGame',$location.search().game);
    } else if ($location.search().custom) {
      game.joinGame('joinGame',null,true);
    } else {
      game.joinGame();
    }

}]);
