(function () {
  "use strict";

  angular.module('gslrApp')
    .controller('LoginCtrl', [
      'ProperViewService',
      '$scope',
      'State',
      '$filter',
      'ChannelService',
      'SC',
      function (ProperViewService, $scope, State, $filter, ChannelService, SC) {
        if (ProperViewService()) {

          $scope.user = State.user;

          $scope.otpKeyPress = function ($event) {
            if ($event.which == 13) $scope.login();
          };

          $scope.login = function () {
            if ($scope.user.otp.length != 4) {
              // todo: toast 4 digit otp
              alert('4 Character One Time Password is required.');
              return;
            }
            ChannelService.login.listenOnce(function (data) {
              if (data.status == SC.SUCCESS) {
                State.user.loggedIn = true;
                $scope.$apply(ProperViewService);
              } else if (data.status == SC.INCORRECT.OTP) {
                // todo: toast incorrect otp
                alert('Incorrect One Time Password.');
                State.user.otp = '';
              } else if (data.status == SC.NOT.REGISTERED) {
                // todo: toast not registered yet
                alert($scope.user.mobile + ' is registered yet.');
                State.user.mobile = '';
                State.user.otp = '';
                State.registered = false;
                $scope.$apply(ProperViewService);
              } else if (window.GSLR.WEBSOCKETS.DEBUG) console.log(data);
            });
            ChannelService.login.emit({
              mobile: $scope.user.mobile,
              otp: $scope.user.otp
            });
          };

          $scope.notMyNumber = function () {
            State.user.mobile = '';
            State.user.otp = '';
            State.user.registered = false;
            ProperViewService();
          };
        }
      }]);

})();