(function () {
  "use strict";

  angular.module('gslrApp')
    .controller('GSLRCtrl', [
      'WebSocketService',
      '$location',
      function (WebSocketService, $location) {

        WebSocketService.hooks.open = function () {
          $location.url('/register');
        };

        WebSocketService.hooks.close = function () {
          $location.url('/connect');
        };

      }]);

})();