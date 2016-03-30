(function () {
  "use strict";

  angular.module('gslrApp')
    .value('State', {
      name: '',
      year: 0,
      gs: {
        name: '',
        mascot: ''
      },
      lr: {
        name: '',
        mascot: ''
      },
      user: {
        mobile: 0,
        registered: false,
        otp: '',
        loggedIn: false
      },
      currentEvent: {
        name: '',
        gsTeamName: '',
        lrTeamName: '',
        voted: ''
      }
    });

})();