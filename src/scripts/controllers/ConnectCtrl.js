(function () {
  "use strict";

  angular.module('gslrApp')
    .controller('ConnectCtrl', [
      'ProperViewService',
      function (ProperViewService) {
        if (ProperViewService()) {

        }
      }]);

})();