(function () {
    'use strict';

    angular.module('app', [
        // Angular modules 
        'ngRoute',
        'ngStorage',
        'ngOnload',
        // app modules 
        'app.home',
        'app.rooms',
        'app.common',
        // 3rd Party Modules
        'angularSpinner'
    ])
})();