(function () {
    'use strict';

    angular
        .module('app')
        .factory('localStorage', localStorage);

    localStorage.$inject = ['$http'];

    function localStorage($http) {
        var service = {
            getData: getData
        };

        return service;

        function getData() { }
    }
})();