(function () {
  "use strict";

  angular.module('gslrApp')
    .value('State', {
      name: '',
      year: '',
      gs: {
        name: '',
        mascot: ''
      },
      lr: {
        name: '',
        mascot: ''
      },
      user: {
        mobile: '',
        registered: false,
        otp: '',
        loggedIn: false
      }
    });

})();