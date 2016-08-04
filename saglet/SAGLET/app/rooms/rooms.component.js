(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('roomsComponent', {
            templateUrl: 'app/rooms/rooms.component.html',
            controllerAs: 'vm',
            controller: ['$sessionStorage', '$sce', controller]
        });

    function controller($sessionStorage, $sce) {
        var vm = this;
        vm.user;

        this.$onInit = function () { 
             //shareData.getUser().then(function (_user) {
             //    vm.roomList = _roomList;
             //})
             //var detailsHub =  $.connection.roomDetailsHub
             if ($sessionStorage.user) {
                 vm.roomList = $sessionStorage.user.rooms.watch;
             }

            
        }
    }


})();