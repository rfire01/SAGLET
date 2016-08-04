(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('shareData', factory);

    factory.$inject = ['$q'];

    function factory($q) {
        var that = this;

        that.user;

        var service = {
            setUser: setUser,
            getUser: getUser
        };

        return service;

        function getUser() {
            return $q(function (resolve, reject) {
                resolve(that.user);
            })
           
        }
        function setUser(user) {
            that.user = user;
        }
    }
})();