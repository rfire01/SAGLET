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
                cpFlag: '<'
            },
            controllerAs: 'vm',
            controller: ['$window', controller]
        })
    function controller($window) {
        var vm = this;



        vm.overview = true;
        vm.screenWidth = '';
        vm.roomsCtrl = [];
        //vm.cp = {};
        // vm.handelCriticalPoints = handelCriticalPoints;


        this.addRoom = addRoom
        this.openFullViewSelectedRoom = openFullViewSelectedRoom;
        this.closeFullViewSelectedRoom = closeFullViewSelectedRoom;



        this.$onInit = function () {
            if (vm.newCp) {
                handelCriticalPoints(vm.cp.id, vm.cp.msg)
            }
            vm.screenWidth = $window.screen.availWidth
            console.log($window.screen.availHeight);
            console.log($window.screen.availWidth);
        }

        this.$onChanges = function (changesObj) {
            console.log("** overview changes **");
            console.log(changesObj);
            if (changesObj.cpRoom || changesObj.cpMsg)
                handelCriticalPoints(this.cpRoom, this.cpMsg);
            //var room = changesObj.cpRoom.currentValue;





        }


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

        function closeFullViewSelectedRoom() {
            for (var i in vm.roomsCtrl) {
                vm.roomsCtrl[i].setFullView(false);
                vm.roomsCtrl[i].setHide(false);
            }
            vm.overview = true;

        }



        function addRoom(room) {
            vm.roomsCtrl.push(room);
        }


        function handelCriticalPoints(roomID, msg) {
            vm.roomsCtrl.forEach(function (roomCtrl) {
                if (roomCtrl.room.ID == roomID) {
                    roomCtrl.setCriticalPoint(msg);
                    return;
                }




            })

        }


        //function moveRoomItemToFirstPlace(roomID) {
        //    for (var i in vm.rooms) {
        //        if (roomID == vm.rooms[i].ID) {
        //            var tempHoldRoom = vm.rooms[i];
        //            vm.rooms.splice(i, 1);
        //            vm.rooms.unshift(tempHoldRoom);
        //        }

        //    }
        //}






    }
})();
