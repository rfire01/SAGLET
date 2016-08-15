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
                
                
                    
                    
                    //detailsHub.server.joinGroup('149');
                //listenToTheseVmtRooms(vm.roomList);

                vm.roomList.forEach(function (item) {
                    detailsHub.server.joinGroup(item.ID);
                })

                
                })
            .fail(function () {
                console.log('Could not Connect!');
            });



            detailsHub.client.registeredComplete = function (res) {
                console.info("************ Registered Complete ************");
                console.log(res);
                var connectionStatus = angular.element(document.querySelector('#connection-status'));
                connectionStatus.removeClass('label-danger label-warning').text('Online').addClass('label-success');
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

                        //console.log(cp.Type);
                        //console.log(cp.Status);
                        //console.log(cp.Priority);

                        //console.log(cp.Msg.Text);
                        //console.log(cp.Msg.TimeStamp);
                        //console.log(cp.Msg.UserID);

                        vm.cpRoom = cp.GroupID;
                        vm.cpMsg = cp.Msg.Text;
                        vm.cpType = cp.Type;
                        vm.cpUser = cp.Msg.UserID;
                        vm.cpTime = cp.Msg.TimeStamp;
                        vm.cpPriority = cp.Priority;

                        vm.newCp = true;
                    })
                        
                        
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
                    DS: false,
                    TEC: false,
                    NMD: false
                };
            })
            return rooms;
        }

        function returnCp(id ,cp) {
            return $q(function (resolve, reject) {
                resolve(cp);

            })
        }

        function onNewCriticalPoints(roomID, msg) {

        }
    }


})();