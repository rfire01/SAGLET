(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('roomsOverview', {
            templateUrl: 'app/rooms/components/rooms-overview/rooms-overview.component.html',
            bindings: {
                rooms: '<'
            
            },
            controllerAs: 'vm',
            controller: controller
        })
    function controller() {
        var vm = this;
        
              
        vm.overview = true;
        

        vm.roomsCtrl = [];

       
        this.addRoom = addRoom
        this.openFullViewSelectedRoom = openFullViewSelectedRoom;
        this.closeFullViewSelectedRoom = closeFullViewSelectedRoom;



        this.$onInit = function () { }

        this.$onChanges = function (changesObj) {
            console.log(changesObj);
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
