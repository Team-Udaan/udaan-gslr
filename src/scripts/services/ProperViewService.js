(function () {
  "use strict";

  angular.module('gslrApp')
    .service('ProperViewService', [
      'WebSocketService',
      '$location',
      function (WebSocketService, $location) {
        return function () {
          var view = $location.url();
          var connected = WebSocketService.socket.status.connected;
          if (view == '/connect' && connected) {
            $location.url('/register');
            return false;
          } else if (view != '/connect' && !connected) {
            $location.url('/connect');
            return false;
          } else return true;
        }
      }]);

})();