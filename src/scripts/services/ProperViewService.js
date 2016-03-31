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

          if (!connected) {
            if (view == '/connect') return true;
            $location.url('/connect');
            return false;
          }

          if (!State.user.registered) {
            if (view == '/register') return true;
            $location.url('/register');
            return false;
          }

          if (!State.user.loggedIn) {
            if (view == '/login') return true;
            $location.url('/login');
            return false;
          }

          if (view == '/poll') return true;
          $location.url('/poll');
          return false;
        }
      }
    ])
  ;

})
();