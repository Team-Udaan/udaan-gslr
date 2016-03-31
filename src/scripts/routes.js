(function () {
  "use strict";

  angular.module('gslrApp')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/connect', {
          templateUrl: 'templates/connect.html',
          controller: 'ConnectCtrl'
        })
        .when('/register', {
          templateUrl: 'templates/register.html',
          controller: 'RegisterCtrl'
        })
        .when('/login', {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        })
        .when('/poll', {
          templateUrl: 'templates/poll.html',
          controller: 'PollCtrl'
        })
        .otherwise({
          redirectTo: '/connect'
        });
    }]);

})();