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
                cpPriority: '<'
               
            },
            controllerAs: 'vm',
            controller: ['$window', controller]
        })
    function controller($window) {
        var vm = this;



        vm.overview = true;
        vm.screenWidthHeight = {}
        vm.roomsCtrl = [];
        //vm.cp = {};
        // vm.handelCriticalPoints = handelCriticalPoints;


        this.addRoom = addRoom
        this.openFullViewSelectedRoom = openFullViewSelectedRoom;
        this.closeFullViewSelectedRoom = closeFullViewSelectedRoom;



        this.$onInit = function () {
            
            vm.screenWidthHeight = setScreenWidthHeight();
            
        }

        this.$onChanges = function (changesObj) {
          
            if (changesObj.cpRoom || changesObj.cpMsg || changesObj.cpType || changeObj.cpUser)
                handelCriticalPoints(this.cpRoom);  
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


        function handelCriticalPoints(roomID) {
            vm.roomsCtrl.forEach(function (roomCtrl) {
                if (roomCtrl.room.ID == roomID) {
                    roomCtrl.setCriticalPoint(vm.cpMsg, vm.cpType, vm.cpUser, vm.cpTime, vm.cpPriority);
                    return;
                }




            })

        }

        function setScreenWidthHeight() {
            
            var width = $window.screen.availWidth;
            var height = $window.screen.availHeight;

            console.log(width + 'x' + height);

            return width + 'x';
            
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
