/* A dummy test suit to test the functionality of the Karma test set-up */
/* eslint-disable */
describe('A TESTING OF THE KARMA FRONTEND TEST', () => {
  beforeEach(() => {
    module('mean');
  });

  it('should map routes to home page', function() {
    inject(function($route) {
      expect($route.routes['/'].templateUrl).
      toEqual('views/index.html');

      // otherwise redirect to
      expect($route.routes[null].redirectTo).toEqual('/');
    });
  });

  it('should map routes to sign in page', function() {
    inject(function($route) {
      expect($route.routes['/signin'].templateUrl).
      toEqual('/views/signin.html');

      // otherwise redirect to
      expect($route.routes[null].redirectTo).toEqual('/');
    });
  });

  it('should map routes to sign up page', function() {
    inject(function($route) {
      expect($route.routes['/signup'].templateUrl).
      toEqual('/views/signup.html');

      // otherwise redirect to
      expect($route.routes[null].redirectTo).toEqual('/');
    });
  });
  // angular.module('myModule', ['ngRoute'])
  //   .config(function($routeProvider) {
  //     $routeProvider.when('/home', {
  //       template : 'welcome to {{ title }}',
  //       controller : 'HomeCtrl'
  //     });
  //   })
  //   .controller('HomeCtrl', function($scope) {
  //     $scope.title = 'my home page';
  //   });

  //this test spec uses mocha since it has nice support for async testing...
  // describe('home spec', function() {
  //   var tester;
  //   beforeEach(function() {
  //     tester = ngMidwayTester('myModule');
  //   });
  //
  //   afterEach(function() {
  //     tester.destroy();
  //     tester = null;
  //   });
  //
  //   it('should have a working home page', function(done) {
  //     tester.visit('/home', function() {
  //       expect(tester.path()).toEqual('/home');
  //       console.log('element: ', tester.viewElement());
  //       done();
  //     });
  //   });
  // });
});
