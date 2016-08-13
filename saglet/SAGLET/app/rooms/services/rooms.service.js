(function () {
    'use strict';

    angular
        .module('app.rooms')
        .factory('rooms', rooms);

    rooms.$inject = ['$http'];

    function rooms($http) {
        var service = {
            getData: getData
        };

        return service;

        function getData() { }
    }
})();