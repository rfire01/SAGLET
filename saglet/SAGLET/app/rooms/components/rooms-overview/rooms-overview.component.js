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
            controllerAs: 'vm',
            controller: ['$window', '$interval', controller]
        })
    function controller($window, $interval) {
        var vm = this;



        vm.overview = true;
        vm.screenWidthHeight = {}
        vm.roomsCtrl = [];

        //vm.cp = {};
        // vm.handelCriticalPoints = handelCriticalPoints;


        this.addRoom = addRoom
        this.openFullViewSelectedRoom = openFullViewSelectedRoom;
        this.closeFullViewSelectedRoom = closeFullViewSelectedRoom;



        this.$onInit = function (bindings) {
            console.log(bindings);
            vm.screenWidthHeight = setScreenWidthHeight();
            //var time = ['3000', '2000', '5000', '8000', '10000', '180000', '200000', '220000'];
            //var cpsss = $interval(function () {

            //    var message = ['msg1', 'msg2', 'במכבי ת"א מודאגים לקראת המפגש בספליט‏', "קוז'יקרו פוטר מחיפה"];
            //    var type = ['13', '16', '17'];
            //    var isers = ['אבי נמני', 'berko', 'איציק הסיני', 'assad', 'sadam']
            //    vm.cpRoom = '149'
            //    vm.cpMsg = message[Math.floor(Math.random() * message.length)];


            //    vm.cpType = type[Math.floor(Math.random() * type.length)];
            //    vm.cpType = '16'
            //    //vm.cpUser = isers[Math.floor(Math.random() * isers.length)];

            //    vm.cpTime = new Date().toTimeString().substring(0, 8);
            //    //vm.cpPriority = cp.Priority;
            //    handelCriticalPoints(vm.cpRoom, vm.cpType)
            //    console.log('fff ');
            //}, 5000);


        }

        this.$onChanges = function (changesObj) {

            if (changesObj.cpRoom || changesObj.cpMsg || changesObj.cpType || changesObj.cpUser || changesObj.cpAlertType || changesObj.cpTime)
                handelCriticalPoints(this.cpRoom, changesObj.cpType);


            //handelCriticalPoints

            //if (changesObj.idlenessRoom && changesObj.idlenessUsers.currentValue.length > 0)
            //    handelIdleness(vm.idlenessRoom);

            //handelCriticalPoints(this.idlenessRoom, 'idle');



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


        function handelCriticalPoints(roomID, newCpType) {

            //var type = vm.cpType;
            //var msg = vm.cpMsg;


            //if (newCpType == 18) {
            //    if (!vm.idlenessUsers.length || vm.idlenessUsers.length == 0)
            //        return;

            //    type = 'idle';
            //    msg = vm.idlenessUsers;
            //}


            vm.roomsCtrl.forEach(function (roomCtrl) {
                if (roomCtrl.room.ID == roomID) {
                    roomCtrl.setCriticalPointMessages(vm.cpType, vm.cpMsg, vm.cpUser, vm.cpTime, vm.cpPriority, vm.cpAlertType);
                    return;
                }
            })
        }

        function setScreenWidthHeight() {

            var width = $window.screen.width;
            var height = $window.screen.height;

            console.log("*** screen ***");
            console.log(width + 'x' + height);

            return width + 'x' + height;

        }

        function handelIdleness(roomID) {
            vm.roomsCtrl.forEach(function (roomCtrl) {
                if (roomCtrl.room.ID == roomID) {
                    roomCtrl.setIdleness(vm.idlenessUsers);
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
