(function () {
  "use strict";

  angular.module('gslrApp')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/register', {
          templateUrl: 'templates/register.html',
          controller: 'RegisterCtrl'
        })
        .when('/login', {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        })
        .when('/poll', {
          templateUrl: 'templates/login.html',
          controller: 'PollCtrl'
        })
        .otherwise({
          redirectTo: '/register'
        });
    }]);

})();