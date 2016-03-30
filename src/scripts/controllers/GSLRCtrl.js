(function () {
  "use strict";

  angular.module('gslrApp')
    .controller('GSLRCtrl', [
      'WebSocketService',
      'ProperViewService',
      '$scope',
      function (WebSocketService, ProperViewService, $scope) {

        WebSocketService.socket.hooks.open = WebSocketService.socket.hooks.close = function () {
          $scope.$apply(ProperViewService);
        };

      }]);

})();