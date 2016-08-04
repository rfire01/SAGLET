(function () {
    'use strict';

    angular.
        module('app').
        config(['$locationProvider', '$routeProvider',
         function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.
                 when('/', {
                     template: '<home-component></home-component>'
                 }).
                when('/rooms', {
                    template: '<rooms-component></rooms-component>'
                }).
                when('/actions', {
                    template: '<actions-component></actions-component>'
                }).
          
            otherwise('/');
        }
        ]);
})();