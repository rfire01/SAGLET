(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('roomsOverview', {
            templateUrl: 'app/rooms/components/rooms-overview/rooms-overview.component.html',
            bindings: {
                rooms: '<',
                cp: '<',
                newCp: '<',
                cpRoom: '<',
                cpMsg: '<',
                cpType: '<',
                cpUser: '<',
                cpTime: '<',
                cpPriority: '<',
                cpAlertType: '<',
                idlenessUsers: '<',
                idlenessRoom: '<'
            },
            require: {
                "parent": "^roomsComponent"
            },
            controllerAs: 'vm',
            controller: ['$window', '$interval', controller]
        })

    function controller($window, $interval) {
        var vm = this;

        vm.overview = true;
        vm.enlarge = false;
        vm.roomsCtrl = [];

        this.addRoom = addRoom;
        this.openFullViewSelectedRoom = openFullViewSelectedRoom;
        this.closeFullViewSelectedRoom = closeFullViewSelectedRoom;

        this.$onInit = function () {
            if (vm.rooms.length < 4)
                vm.enlarge = true;
        }

        this.$onChanges = function (changesObj) { }

        /* open the selected room in fullview and hide others */
        function openFullViewSelectedRoom(room) {
            for (var i in vm.roomsCtrl) {
                if (room == vm.roomsCtrl[i]) {
                    vm.roomsCtrl[i].setFullView(true);
                    vm.roomsCtrl[i].setHide(false);
                } else {
                    vm.roomsCtrl[i].setFullView(false);
                    vm.roomsCtrl[i].setHide(true);
                }
            }

            vm.overview = false;
        }

        /* unhide all rooms and change to overview */
        function closeFullViewSelectedRoom() {
            for (var i in vm.roomsCtrl) {
                vm.roomsCtrl[i].setFullView(false);
                vm.roomsCtrl[i].setHide(false);
            }

            vm.overview = true;
        }

        /* add room */
        function addRoom(room) {
            vm.roomsCtrl.push(room);
            this.parent.addRoom(room);
        }

        /* handle critical points at the matching room */
        function handelCriticalPoints(roomID, newCpType) {
            vm.roomsCtrl.forEach(function (roomCtrl) {
                if (roomCtrl.room.ID == roomID) {
                    roomCtrl.setCriticalPointMessages(vm.cpType, vm.cpMsg, vm.cpUser, vm.cpTime, vm.cpPriority, vm.cpAlertType);
                    return;
                }
            })
        }
    }
})();
