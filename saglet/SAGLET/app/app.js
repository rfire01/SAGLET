(function () {
    'use strict';

    angular.module('app', [
        // Angular modules 
        'ngRoute',
        'ngStorage',
        // app modules 
        'app.home',
        'app.rooms',
        'app.actions',
        'app.common',
        // 3rd Party Modules
        'angularSpinner'
    ])
   
})();