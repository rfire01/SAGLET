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
        vm.loader = true;
        vm.user;
        vm.roomList = [];
        vm.cp = {};
        vm.newCp = false;
        vm.cpRoom = '';
        vm.cpMsg = '';
        
        
        vm.cpUser = ''
        vm.cpTime = new Date();
        
        vm.cpType = ''
        vm.cpPriority = ''
        vm.cpAlertType = ''

        vm.idlenessRoom = '';
        vm.idlenessUsers = [];

        vm.onNewCriticalPoints = onNewCriticalPoints;

        vm.hubConnectionStauts = '';

        this.$onInit = function () {

            

            if ($sessionStorage.user)
                vm.roomList = ($sessionStorage.user.rooms.watch);
            //vm.roomList = $sessionStorage.user.rooms.watch;
            if (!$sessionStorage.rooms)
                $sessionStorage.rooms = [];

            $.connection.hub.logging = true;
            /* Hub Start */

            $.connection.hub.start()
                .done(function (res) {
                    console.info("************ hub started ************");

                    vm.loader = false;
                    
                    var strRoomsList = getStrRoomsList(vm.roomList);
                    detailsHub.server.startIdleness(strRoomsList);

                    vm.roomList.forEach(function (item) {
                        detailsHub.server.joinGroup(item.ID);
                    })

                    var check = $interval(function () {
                        var strRoomsList = getStrRoomsList(vm.roomList);
                        detailsHub.server.checkIdleness(strRoomsList);
                    }, 15000);

                })
            .fail(function () {
                console.log('Could not Connect!');
                vm.loader = false;
                vm.hubConnectionStauts = 'fail'
            });
         
            

        }

        this.$onChanges = function (c) { };


        $.connection.hub.connected = function () {
            vm.hubConnectionStauts = 'connected';
            var connectionStatus = angular.element(document.querySelector('#connection-status'));
            connectionStatus.removeClass('label-danger label-warning').text('Online').addClass('label-success');
        }

        $.connection.hub.reconnecting = function () {

            var connectionStatus = angular.element(document.querySelector('#connection-status'));
            connectionStatus.removeClass('label-success label-danger').text('Reconnecting').addClass('label-warning');
        }



        $.connection.hub.disconnected(function () {

            console.log(" **** Hub: disconnected **** ");

            vm.hubConnectionStauts = 'disconnected';
            var connectionStatus = angular.element(document.querySelector('#connection-status'));
            connectionStatus.removeClass('label-success').text('Offline').addClass('label-danger label-warning');
            
            setTimeout(function () {
                $.connection.hub.start();
            }, 5000);

        });



        detailsHub.client.updateIdlenessLive = function (idelenssData) {
            console.info("************ updateIdlenessLive ************");
            console.info(idelenssData);
            var idel = JSON.parse(idelenssData);
            console.info(idel);
            for (var room in idel) {
                vm.idlenessRoom = room;
                vm.idlenessUsers = idel[room];
                
            }
            

        };

        detailsHub.client.registeredComplete = function (res) {
            console.info("************ Registered Complete ************");
            console.log("************" + res + "************");

            var connectionStatus = angular.element(document.querySelector('#connection-status'));
            connectionStatus.removeClass('label-danger label-warning').text('Online').addClass('label-success');
            
        };
        


        detailsHub.client.updateRoomMsgLive = function (roomID, cpObject) {
            console.info('************ updateRoomMsgLive: ************ ' + roomID);
           
            returnCp(cpObject).then(function (cp) {
                if (cp.CriticalPoints[0].Type == 0)
                    return;

                if (cp.CriticalPoints[0].Type > 0)
                    vm.newCp = true;

               

                vm.cpRoom = cp.GroupID;
                vm.cpMsg = cp.Text;
                vm.cpUser = cp.UserID;
                vm.cpTime = new Date().toTimeString().substring(0, 8);
                //vm.cpTime = new Date(cpObject.TimeStamp).toTimeString().substring(0, 8) || new Date();

                vm.cpType = cp.CriticalPoints[0].Type;
                vm.cpPriority = cp.CriticalPoints[0].Priority;

                vm.cpAlertType = cp.CriticalPoints[1].Type;
                // vm.cpAlertPriority = cp.CriticalPoints[0].Priority;

                if (cp.CriticalPoints[0].Type == 0)
                    return;

                if (cp.CriticalPoints[0].Type > 0)
                    vm.newCp = true;

            })
           
            

            

          

           
        };


        function listenToTheseVmtRooms(rooms) {
            rooms.forEach(function (item) {
                $.connection.roomDetailsHub.server.joinGroup(item.ID);
            })
        }
        

        function returnCp(cp) {
            return $q(function (resolve, reject) {
                resolve(JSON.parse(cp));

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