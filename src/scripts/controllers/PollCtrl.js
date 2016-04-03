(function () {
  "use strict";

  angular.module('gslrApp')
    .controller('PollCtrl', [
      'ProperViewService',
      '$scope',
      'ChannelService',
      function (ProperViewService, $scope, ChannelService) {
        if (ProperViewService()) {
          $scope.event = null;
          $scope.listenerID = ChannelService.event.listen(function (data) {
            $scope.$apply(function () {
              $scope.event = data;
            });
          });

          $scope.$on('$destroy', function () {
            ChannelService.event.ignore($scope.listenerID);
          });
        }
      }]);

})();