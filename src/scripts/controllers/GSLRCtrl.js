(function () {
  "use strict";

  angular.module('gslrApp')
    .controller('GSLRCtrl', [
      'WebSocketService',
      'ProperViewService',
      '$scope',
      'ChannelService',
      'State',
      function (WebSocketService, ProperViewService, $scope, ChannelService, State) {

        WebSocketService.socket.hooks.open = WebSocketService.socket.hooks.close = function () {
          $scope.$apply(ProperViewService);
        };

        WebSocketService.socket.hooks.bootstrap = function () {
          ChannelService.meta.emit();
        };

        ChannelService.meta.listenOnce(function (data) {
          State.name = data.name;
          State.year = data.year;
          State.gs.name = data.gs.name;
          State.gs.mascot = data.gs.mascot;
          State.lr.name = data.lr.name;
          State.lr.mascot = data.lr.mascot;
          document.title = State.name + ' ' + State.year;
        });

      }]);

})();