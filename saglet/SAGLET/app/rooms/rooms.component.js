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

        vm.roomsCtrl = [];

        var detailsHub = $.connection.roomDetailsHub;
        var idleAlertFreq = 60000 * 3;

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

        this.addRoom = addRoom;

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
                    detailsHub.server.registerLiveChatAndLiveActions(strRoomsList);
                    detailsHub.server.startIdleness(strRoomsList);

                    vm.roomList.forEach(function (item) {
                        detailsHub.server.joinGroup(item.ID);
                    })
                    
                    //console.log(idleAlertFreq);

                    //detailsHub.client.updateIdlenessAlertFrequency = function (freq) {
                    //    console.log("freq " + freq);
                    //    idleAlertFreq = freq;
                    //}

                    var check = $interval(function () {
                        var strRoomsList = getStrRoomsList(vm.roomList);
                        detailsHub.server.checkIdleness(strRoomsList);

                        console.log("check " + idleAlertFreq);
                    }, idleAlertFreq);

                })
            .fail(function () {
                console.log('Could not Connect!');
                vm.loader = false;
                vm.hubConnectionStauts = 'fail'
            });
         
            

        }

        this.$onChanges = function (c) {
            console.log(c);
        };


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
            }, 60000);

        });



        detailsHub.client.updateIdlenessLive = function (idleRoom, idelenssData) {
            console.info("************ updateIdlenessLive ************");
            
            var idel = JSON.parse(idelenssData);
            console.log(idel);
            console.log(idleRoom);

            returnCp(idelenssData).then(function (idle) {
                if (idel.Key == '18') {
                    vm.newCp = true;

                  
                    vm.cpRoom = idleRoom;
                    vm.cpMsg = '';
                    vm.cpUser = idle.Value;
                    vm.cpTime = new Date().toTimeString().substring(0, 8);
                    //vm.cpTime = new Date(cpObject.TimeStamp).toTimeString().substring(0, 8) || new Date();

                    vm.cpType = 18;
                    vm.cpPriority = '';

                    vm.cpAlertType = 18;

                    handelCriticalPoints(vm.cpRoom, vm.cpType);

                }
            })
            //if (idel.Key == '18') {
            //    console.log(idel.Key);
            //    vm.idlenessRoom = idleRoom;
            //    vm.idlenessUsers = idel.Value;
            //}
            
            console.log(vm.idlenessRoom);
            console.log(vm.idlenessUsers);
        };

        detailsHub.client.registeredComplete = function (res) {
            console.info("************ Registered Complete ************");
            console.log("************" + res + "************");

            var connectionStatus = angular.element(document.querySelector('#connection-status'));
            connectionStatus.removeClass('label-danger label-warning').text('Online').addClass('label-success');
            
        };
        

        detailsHub.client.sendLogToConsole = function (log)
        {
            console.info(log);
        }

        detailsHub.client.updateRoomMsgLive = function (roomID, cpObject) {
            console.info('************ updateRoomMsgLive: ************ ' + roomID);
           
            returnCp(cpObject).then(function (cp) {
                if (cp.CriticalPoints[1].Type == 0)
                    return;

                if (cp.CriticalPoints[1].Type > 0)
                    vm.newCp = true;

               

                vm.cpRoom = cp.GroupID;
                vm.cpMsg = cp.Text;
                vm.cpUser = cp.UserID;
                vm.cpTime = new Date().toTimeString().substring(0, 8);
                //vm.cpTime = new Date(cpObject.TimeStamp).toTimeString().substring(0, 8) || new Date();

                vm.cpType = cp.CriticalPoints[1].Type;
                vm.cpPriority = cp.CriticalPoints[1].Priority;

                vm.cpAlertType = cp.CriticalPoints[1].Type;
                // vm.cpAlertPriority = cp.CriticalPoints[0].Priority;

                //if (cp.CriticalPoints[0].Type == 0)
                //    return;

                //if (cp.CriticalPoints[0].Type > 0)
                //    vm.newCp = true;

                handelCriticalPoints(vm.cpRoom, vm.cpType);

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

        function addRoom(room) {
            vm.roomsCtrl.push(room);
        }

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