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
        var idleAlertFreq = 20000;
        var disconnectCheckFreq = 5000;

        vm.loader = true;
        vm.user;
        vm.roomList = [];
        vm.cp = {};
        vm.newCp = false;
        vm.cpRoom = '';
        vm.cpMsg = '';
        vm.cpUser = '';
        vm.cpTime = new Date();
        
        vm.cpType = '';
        vm.cpPriority = '';
        vm.cpAlertType = '';

        vm.idlenessRoom = '';
        vm.idlenessUsers = [];
        vm.strRoomsList = '';
        vm.hubConnectionStatus = '';

        this.addRoom = addRoom;

        this.$onInit = function () {
            if ($sessionStorage.user)
                vm.roomList = ($sessionStorage.user.rooms.watch);

            if (!$sessionStorage.rooms)
                $sessionStorage.rooms = [];

            $.connection.hub.logging = true;

            /* Hub Start */
            $.connection.hub.start()
                .done(function (res) {
                    initHub();
                    vm.loader = false;

                    /* check idleness */
                    $interval(function () {
                        if (vm.hubConnectionStatus != 'disconnected') {
                            var strRoomsList = getStrRoomsList(vm.roomList);
                            detailsHub.server.checkIdleness(strRoomsList);
                        }
                    }, idleAlertFreq);

                    /* check connection */
                    $interval(function () {
                        if (vm.hubConnectionStatus == 'disconnected') {
                            // display reconnecting
                            var connectionStatus = angular.element(document.querySelector('#connection-status'));
                            connectionStatus.removeClass('label-success label-danger').text('Reconnecting').addClass('label-warning');
                            
                            // try connect
                            $.connection.hub.start().done(function (res) {
                                initHub();
                            });
                        }
                    }, disconnectCheckFreq);
                })
            .fail(function () {
                console.info("************ hub start failure ************");
                vm.loader = false;
                vm.hubConnectionStatus = 'failure';
            });
        }

        this.$onChanges = function (c) {
            console.log(c);
        };

        /* Initialize Hub */
        function initHub() {
            console.info("************ hub started ************");
            var strRoomsList = getStrRoomsList(vm.roomList);
            detailsHub.server.registerLiveChatAndLiveActions(strRoomsList);
            detailsHub.server.startIdleness(strRoomsList);

            vm.roomList.forEach(function (item) {
                detailsHub.server.joinGroup(item.ID);
            })
        }

        /* Hub reconnecting event handler */
        $.connection.hub.reconnecting = function () {
            vm.hubConnectionStatus = 'reconnecting';
            var connectionStatus = angular.element(document.querySelector('#connection-status'));
            connectionStatus.removeClass('label-success label-danger').text('Reconnecting').addClass('label-warning');
        }

        /* Hub disconnected event handler */
        $.connection.hub.disconnected(function () {
            console.log(" **** hub: disconnected **** ");

            vm.hubConnectionStatus = 'disconnected';
            var connectionStatus = angular.element(document.querySelector('#connection-status'));
            connectionStatus.removeClass('label-success').text('Offline').addClass('label-danger label-warning');
        });

        /* Hub connected event handler */
        detailsHub.client.registeredComplete = function (res) {
            console.info("************ Registered Complete ************");
            console.log("************" + res + "************");

            vm.hubConnectionStatus = 'connected';
            var connectionStatus = angular.element(document.querySelector('#connection-status'));
            connectionStatus.removeClass('label-danger label-warning').text('Online').addClass('label-success');
        };

        /* log to console */
        detailsHub.client.sendLogToConsole = function (log) {
            console.info(log);
        }

        /* idleness event handler */
        detailsHub.client.updateIdlenessLive = function (idleRoom, idelenssData) {
            console.info("************ updateIdlenessLive ************");

            returnCp(idelenssData).then(function (idle) {
                if (idle.Key == '18') {
                    vm.newCp = true;
                    vm.cpRoom = idleRoom;
                    vm.cpMsg = '';
                    vm.cpUser = idle.Value;
                    vm.cpTime = new Date().toTimeString().substring(0, 8);

                    vm.cpType = 18;
                    vm.cpPriority = '';
                    vm.cpAlertType = 18;

                    handelCriticalPoints(vm.cpRoom, vm.cpType);
                }
            })
            
            console.log(vm.idlenessRoom);
            console.log(vm.idlenessUsers);
        };

        /* user join & user left event handler */
        detailsHub.client.updateRoomUsersLive = function (roomID, roomData) {
            console.info("************ updateRoomUsersLive ************");

            returnCp(roomData).then(function (room) {
                if (room.Key == '19') {
                    vm.newCp = true;
                    vm.cpRoom = roomID;
                    vm.cpMsg = '';
                    vm.cpUser = room.Value;
                    vm.cpTime = new Date().toTimeString().substring(0, 8);

                    vm.cpType = 19;
                    vm.cpPriority = '';
                    vm.cpAlertType = 19;

                    handelCriticalPoints(vm.cpRoom, vm.cpType);
                } else if (room.Key == '20') {
                    vm.newCp = true;
                    vm.cpRoom = roomID;
                    vm.cpMsg = '';
                    vm.cpUser = room.Value;
                    vm.cpTime = new Date().toTimeString().substring(0, 8);

                    vm.cpType = 20;
                    vm.cpPriority = '';
                    vm.cpAlertType = 20;

                    handelCriticalPoints(vm.cpRoom, vm.cpType);
                }
            })
        };

        /* new message event handler */
        detailsHub.client.updateRoomMsgLive = function (roomID, cpObject) {
            console.info('************ updateRoomMsgLive: ************ ' + roomID);
           
            returnCp(cpObject).then(function (cp) {
                if (cp.CriticalPoints[1].Type == 0 && cp.CriticalPoints[0].Type == 0)
                    return;

                if (cp.CriticalPoints[1].Type > 0)
                    vm.newCp = true;

                vm.cpRoom = cp.GroupID;
                vm.cpMsg = cp.Text;
                vm.cpUser = cp.UserID;
                vm.cpTime = new Date().toTimeString().substring(0, 8);

                if (cp.CriticalPoints[1].Type == 0 && cp.CriticalPoints[0].Type > 0) {
                    vm.cpType = cp.CriticalPoints[0].Type;
                    vm.cpPriority = cp.CriticalPoints[0].Priority;
                    vm.cpAlertType = 0;
                } else {
                    vm.cpType = cp.CriticalPoints[1].Type;
                    vm.cpPriority = cp.CriticalPoints[1].Priority;
                    vm.cpAlertType = cp.CriticalPoints[1].Type;
                }

                handelCriticalPoints(vm.cpRoom, vm.cpType);
            })        
        };

        /* parses cp object to json */
        function returnCp(cp) {
            return $q(function (resolve, reject) {
                resolve(JSON.parse(cp));
            })
        }

        /* get or create string of the rooms watched*/
        function getStrRoomsList(roomList) {
            if (vm.strRoomsList == '') {
                var str = '';
                roomList.forEach(function (room, i) {
                    if (i == 0)
                        str = room.ID.toString();
                    else
                        str = str + ', ' + room.ID.toString();
                })
                vm.strRoomsList = str;
            }
            return vm.strRoomsList;
        }

        /* add room */
        function addRoom(room) {
            vm.roomsCtrl.push(room);
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