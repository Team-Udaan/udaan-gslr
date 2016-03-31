(function () {
  "use strict";

  angular.module('gslrApp')
    .service('ChannelService', [
      'WebSocketService',
      function (WebSocketService) {
        return {
          meta: WebSocketService.Channel(window.GSLR.CHANNELS.META),
          register: WebSocketService.Channel(window.GSLR.CHANNELS.REGISTER),
          login: WebSocketService.Channel(window.GSLR.CHANNELS.LOGIN)
        };
      }]);

})();