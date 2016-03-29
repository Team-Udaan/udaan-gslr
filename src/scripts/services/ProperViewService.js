(function () {
  "use strict";

  angular.module('gslrApp')
    .service('ProperViewService', [
      'WebSocketService',
      '$location',
      function (WebSocketService, $location) {
        return function () {
          var view = $location.url();
          if (view == 'connect' && WebSocketService.status.connected) {
            $location.url('/register');
            return false;
          } else if (!WebSocketService.status.connected) {
            $location.url('/connect');
            return false;
          } else return true;
        }
      }]);

})();