angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$http', '$window', '$location', 'socket', 'game', 'AvatarService', '$cookies', function ($scope, Global, $http, $window, $location, socket, game, AvatarService, $cookies) {
    $scope.global = Global;

    $scope.playAsGuest = function() {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = false;
    $scope.errorMessage = '';

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });

    $scope.isCookie = () => {
      const userData = $cookies.userData;
      if (userData) {
        $window.localStorage.setItem('userData', userData);
      }
    };

    $scope.isCookie();

    const setData = (data) => {
      if (data) {
        $window.localStorage.setItem('userData', JSON.stringify(data));
        $window.location = '/';
      } else {
        $window.localStorage.removeItem('userData');
      }
    };

    $scope.signup = () => {
      const userInfo = {
        name: $scope.name,
        username: $scope.username,
        email: $scope.email,
        password: $scope.password
      };
      $http.post('/api/auth/signup', userInfo)
        .then((response) => {
          setData(response.data);
        }, ({ data }) => {
          $scope.errorMessage = data.error;
          $scope.showError = true;
          setTimeout(() => {
            $scope.errorMessage = '';
            $scope.showError = false;
          }, 10000);
        });
    };

    $scope.signin = () => {
      const userInfo = {
        email: $scope.email,
        password: $scope.password
      };
      $http.post('/api/auth/login', userInfo)
        .then((response) => {
          setData(response.data);
        }, ({ data }) => {
          $scope.errorMessage = data.error;
          $scope.showError = true;
          console.log($scope.showError, $scope.errorMessage)
          setTimeout(() => {
            $scope.errorMessage = '';
            $scope.showError = false;
            console.log($scope.showError, $scope.errorMessage)
          }, 10000);
        });
    };

    $scope.signout = () => {
      setData();
      $cookies.userData = '';
      $window.location = '/';
    };
  }]);
