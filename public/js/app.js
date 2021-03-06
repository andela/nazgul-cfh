/* eslint-disable object-curly-newline,
 no-undef, array-callback-return, func-names */

angular.module(
  'mean',
  ['ngCookies', 'ngResource', 'ngRoute', 'ui.bootstrap',
    'ui.route', 'mean.system', 'mean.directives', 'firebase']
)
  .config(['$routeProvider', '$sceProvider',
    function ($routeProvider, $sceProvider) {
      $sceProvider.enabled(false);
      $routeProvider.when('/', {
        templateUrl: 'views/index.html'
      }).when('/app', {
        templateUrl: '/views/app.html',
      }).when('/privacy', {
        templateUrl: '/views/privacy.html',
      }).when('/bottom', {
        templateUrl: '/views/bottom.html'
      })
        .when('/signin', {
          templateUrl: '/views/signin.html'
        })
        .when('/signup', {
          templateUrl: '/views/signup.html'
        })
        .when('/choose-avatar', {
          templateUrl: '/views/choose-avatar.html'
        })
        .otherwise({
          redirectTo: '/'
        });
    }
  ]).config(['$locationProvider',
    function ($locationProvider) {
      $locationProvider.hashPrefix('!');
    }
  ]).run(['$rootScope', function ($rootScope) {
    $rootScope.safeApply = function (fn) {
      const phase = this.$root.$$phase;
      if (phase === '$apply' || phase === '$digest') {
        if (fn && (typeof (fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
  }])
  .run(['DonationService', function (DonationService) {
    window.userDonationCb = function (donationObject) {
      DonationService.userDonated(donationObject);
    };
  }]);

angular.module('mean.system', []);
angular.module('mean.directives', []);
