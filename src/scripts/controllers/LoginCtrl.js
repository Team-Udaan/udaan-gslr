(function () {
  "use strict";

  angular.module('gslrApp')
    .controller('LoginCtrl', [
      'ProperViewService',
      function (ProperViewService) {
        if (ProperViewService()) {

        }
      }]);

})();