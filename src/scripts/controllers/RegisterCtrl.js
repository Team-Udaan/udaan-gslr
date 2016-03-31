(function () {
  "use strict";

  angular.module('gslrApp')
    .controller('RegisterCtrl', [
      'ProperViewService',
      '$scope',
      'State',
      '$filter',
      'ChannelService',
      function (ProperViewService, $scope, State, $filter, ChannelService) {
        if (ProperViewService()) {

          $scope.user = State.user;

          var numberFilter = $filter('numberFilter');

          $scope.mobileChange = function () {
            $scope.user.mobile = numberFilter($scope.user.mobile);
          };

          $scope.mobileKeyPress = function ($event) {
            if ($event.which == 13) $scope.register();
          };

          $scope.register = function () {
            if ($scope.user.mobile.length != 10) {
              // todo: toast 10 digit mobile no.
              alert('10 Digit Mobile No. is required.');
              return;
            }
            ChannelService.register.emit({
              mobile: $scope.user.mobile
            });
            $scope.user.registered = true;
            ProperViewService();
          };

        }
      }]);

})();