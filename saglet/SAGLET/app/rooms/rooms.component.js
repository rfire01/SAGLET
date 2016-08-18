(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('roomsComponent', {
            templateUrl: 'app/rooms/rooms.component.html',
            controllerAs: 'vm',
            controller: ['$sessionStorage', '$sce', '$', '$q', '$interval', controller]
        });

    function controller($sessionStorage, $sce, $, $q, $interval) {
        var vm = this;

        var detailsHub = $.connection.roomDetailsHub;

        vm.user;
        vm.roomList = [];
        vm.cp = {};
        vm.newCp = false;
        vm.cpRoom = '';
        vm.cpMsg = '';


        vm.onNewCriticalPoints = onNewCriticalPoints;


        this.$onInit = function () {

            

            if ($sessionStorage.user)
                vm.roomList = ($sessionStorage.user.rooms.watch);
            //vm.roomList = $sessionStorage.user.rooms.watch;


            $.connection.hub.disconnected(function () {

                console.log(" **** Hub: disconnected **** ");
                var connectionStatus = angular.element(document.querySelector('#connection-status'));
                connectionStatus.removeClass('label-success').text('Offline').addClass('label-danger label-warning');
            });



            $.connection.hub.logging = true;
            /* Hub Start */

            $.connection.hub.start()
                .done(function (res) {
                    console.info("************ hub started ************");


                    var strRoomsList = getStrRoomsList(vm.roomList);
                    detailsHub.server.startIdleness(strRoomsList);

                    vm.roomList.forEach(function (item) {
                        detailsHub.server.joinGroup(item.ID);
                    })


                })
            .fail(function () {
                console.log('Could not Connect!');
            });

            var check = $interval(function () {
                var strRoomsList = getStrRoomsList(vm.roomList);
                detailsHub.server.checkIdleness(strRoomsList);
                console.log('** check **');
            }, 5000);

        }

        detailsHub.client.updateIdlenessLive = function (res) {
            console.info("************ Registered Complete ************");
            console.log(res);
            
        };



        detailsHub.client.updateRoomMsgLive = function (roomID, cpObject) {
            console.info('************ updateRoomMsgLive: ************ ' + roomID);
            console.info(' ************ msg ************    ' + cpObject);
            console.log(roomID);
            console.log(cpObject);
            vm.newCp = false;
            returnCp(roomID, cpObject).then(function (CriticalPoints) {
                console.log(CriticalPoints);
                CriticalPoints.forEach(function (cp) {

                    if (cp.Type == 0)
                        return;

                    vm.cpRoom = cp.GroupID;
                    vm.cpMsg = cp.Msg.Text;
                    vm.cpType = cp.Type;
                    vm.cpUser = cp.Msg.UserID;
                    vm.cpTime = new Date(cp.Msg.TimeStamp).toTimeString().substring(0, 8);
                    vm.cpPriority = cp.Priority;

                })
            })
        };


        function listenToTheseVmtRooms(rooms) {
            rooms.forEach(function (item) {
                $.connection.roomDetailsHub.server.joinGroup(item.ID);
            })
        }
        function setupCpObject(rooms) {
            rooms.forEach(function (item) {
                item.cp = {
                    newCp: false,
                    DS: false,
                    TEC: false,
                    NMD: false
                };
            })
            return rooms;
        }

        function returnCp(id, cp) {
            return $q(function (resolve, reject) {
                resolve(cp);

            })
        }

        function onNewCriticalPoints(roomID, msg) {

        }

        function getStrRoomsList(roomList) {
            var str = '';
            roomList.forEach(function (room, i) {
                if (i == 0)
                    str = room.ID.toString();
                else
                str = str + ', ' + room.ID.toString();
            })

            return str;
        }
    }


})();