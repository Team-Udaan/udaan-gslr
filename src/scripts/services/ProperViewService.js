(function () {
  "use strict";

  angular.module('gslrApp')
    .service('ProperViewService', [
      'WebSocketService',
      '$location',
      'State',
      function (WebSocketService, $location, State) {
        return function () {
          var view = $location.url();
          var connected = WebSocketService.socket.status.connected;

          // Is on `to connect` view and connected already
          if (view == '/connect' && connected) {
            $location.url('/register');
            return false;
          }

          // Is on `to register` view and registered already
          if (view == '/register' && State.user.registered) {
            $location.url('/login');
            return false;
          }

          // Is on `to login` view and loggedIn already
          if (view != '/login' && State.user.loggedIn) {
            $location.url('/poll');
            return false;
          }

          return true;
        }
      }]);

})();