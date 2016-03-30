(function () {
  "use strict";

  angular.module('gslrApp')
    .controller('PollCtrl', [
      'ProperViewService',
      function (ProperViewService) {
        if (ProperViewService()) {

        }
      }]);

})();