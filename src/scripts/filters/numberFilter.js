(function () {
  "use strict";

  angular.module('gslrApp')
    .filter('numberFilter', function () {
      return function (string) {
        return string ? string.replace(/\D/g, '') : '';
      }
    });

})();