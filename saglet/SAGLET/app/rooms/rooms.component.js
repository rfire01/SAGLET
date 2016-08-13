(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('roomsComponent', {
            templateUrl: 'app/rooms/rooms.component.html',
            controllerAs: 'vm',
            controller: ['$sessionStorage', '$sce', '$','$q', controller]
        });

    function controller($sessionStorage, $sce, $, $q) {
        var vm = this;
        vm.user;
        vm.roomList = [];
        vm.cp = {};
        vm.newCp = false;
        vm.cpRoom = '';
        vm.cpMsg = '';
       

        vm.onNewCriticalPoints = onNewCriticalPoints;


        this.$onInit = function () { 
             
            var detailsHub = $.connection.roomDetailsHub;

            if ($sessionStorage.user)
                vm.roomList = setupCpObject($sessionStorage.user.rooms.watch);
                  //vm.roomList = $sessionStorage.user.rooms.watch;
                

            $.connection.hub.disconnected(function () {

                console.log(" **** Hub: disconnected **** ");
                var connectionStatus = angular.element(document.querySelector('#connection-status'));
                connectionStatus.removeClass('label-success').text('Offline').addClass('label-danger label-warning');
            });



            $.connection.hub.logging = true;
            /* Hub Start */

            $.connection.hub.start().done(function () {
                console.info("************ hub started ************");

                //detailsHub.server.joinGroup('149');
                listenToTheseVmtRooms(vm.roomList);

                var connectionStatus = angular.element(document.querySelector('#connection-status'));
                connectionStatus.removeClass('label-danger label-warning').text('Online').addClass('label-success');

               
            });



            detailsHub.client.registeredComplete = function (res) {
                console.info("************ Registered Complete ************");
                console.info(res);
            };

            

            detailsHub.client.updateRoomMsgLive = function (roomID, msg) {
                console.info('************ updateRoomMsgLive: ************ ' + roomID);
                console.info(' ************ msg ************    ' + msg);
                console.log(roomID);
                console.log(msg);
                vm.newCp = false;
                returnCp(roomID, msg).then(function (cp) {
                        console.log(cp);
                        vm.cp = cp;
                        vm.cpRoom = cp.id;
                        vm.cpMsg = cp.msg.Text;
                        vm.newCp = true;
                })
                
                //handleCp(roomID, msg)    
            };

            
            

        }



        //function handleCp(roomId, msg) {



        //    vm.roomList.forEach(function(room){
        //        if (room.ID == roomId) {

        //            room.cp.newCp = true;
        //            // just for chekcing
        //            if (msg.Text == '1')
        //                room.cp.cp1 = true;
        //            if (msg.Text == '2')
        //                room.cp.cp2 = true;
        //            if (msg.Text == '3')
        //                room.cp.cp3 = true;
        //            if (msg.Text == '4')
        //                room.cp.cp4 = true;
        //            if (msg.Text == '5')
        //                room.cp.cp5 = true;
        //        }

        //    })

        //}

        function listenToTheseVmtRooms(rooms) {
            rooms.forEach(function (item) {
                $.connection.roomDetailsHub.server.joinGroup(item.ID);
            })
        }
        function setupCpObject(rooms) {
            rooms.forEach(function (item) {
                item.cp = {
                    newCp: false,
                    cp1: false,
                    cp2: false,
                    cp3: false,
                    cp4: false,
                    cp5: false
                };
            })
            return rooms;
        }

        function returnCp(id ,cp) {
            return $q(function (resolve, reject) {
                resolve({id: id, msg:cp});

            })
        }

        function onNewCriticalPoints(roomID, msg) {

        }
    }


})();