(function () {
    'use strict';

    angular
        .module('app.home')
        .constant('$', window.jQuery)
        .component('homeComponent', {
            templateUrl: "/app/home/home.component.html",
            controllerAs: "vm",
            controller: ['$', '$q', '$sessionStorage', 'shareData', controller]
        });

    function controller($, $q, $sessionStorage, shareData) {
        var vm = this;
        
        var indexHub = $.connection.roomIndexHub;



        vm.user = {
            user: '',
            rooms: { watch: [], rest: [] }
        };

        vm.changeWatchStatus = changeWatchStatus;
        //vm.test = function () {
        //    $.connection.hub.stop();
        //}

        this.$onInit = function () {

            $.connection.hub.logging = true;

            /* Hub Start */
            $.connection.hub.start().done(function () {
                console.info(" ** hub started ** ");
                indexHub.server.getUserName();
                //indexHub.server.getRooms();
            });


            

        }
        this.$onDestroy = function () {
            console.info(" ** $.connection.hub.stop ** ");
            $.connection.hub.stop();
        }

        //GetUserName Listner
        indexHub.client.getUserName = function (user) {
            console.info(" ** getUserName ** ");
            returnUser(user)
                .then(function (_userName) {

                    vm.user.user = _userName;


                    indexHub.server.getRooms();

                    console.log(" ** User: " + vm.user.user);
                })

        };



        //GetRooms Listner
        indexHub.client.getRooms = function (roomList) {
            console.info(" ** getRooms ** ");
            returnRooms(roomList)
                .then(function (prop) {
                    vm.user.rooms.watch = prop.watch;
                    vm.user.rooms.rest = prop.rest;

                    $sessionStorage.user = vm.user;
                })
        };



        $.connection.roomIndexHub.client.registeredComplete = function (msg) {
            console.info(msg);
        }


        function returnUser(user) {
            return $q(function (resolve, reject) {

                var name = user;

                if (!$sessionStorage.user || $sessionStorage.user.user != name)
                    $sessionStorage.user = {};




                resolve(name);

            });

        }
        function returnRooms(list) {
            return $q(function (resolve, reject) {

                var watch = [];
                var rest = [];

                if (!$sessionStorage.user.rooms && vm.user.rooms.watch.length == 0 && vm.user.rooms.rest.length == 0 && list.length > 0)
                    rest = list;




                if ($sessionStorage.user.rooms) {
                    list.forEach(function (room) {
                        checkLastRoomStatus(room.ID).then(function (status) {
                            if (status)
                                watch.push(room);
                            else
                                rest.push(room);
                        })
                    })

                }

                resolve({ watch: watch, rest: rest });

            })
        }


        function checkLastRoomStatus(id) {
            return $q(function (resolve, reject) {
                var status = false;
                var isNew = true;
                while (isNew) {
                    $sessionStorage.user.rooms.watch.forEach(function (room) {
                        if (room.ID == id) {
                            status = true;
                            isNew = false;
                        }

                    })

                    $sessionStorage.user.rooms.rest.forEach(function (room) {
                        if (room.ID == id) {
                            status = false;
                            isNew = false;
                        }

                    })
                }

                resolve(status);

            });
        }

        function changeWatchStatus(index, status) {

            // Add to watch list
            if (!status) {
                var thisRoom = vm.user.rooms.rest[index];
                vm.user.rooms.watch.push(thisRoom)
                vm.user.rooms.rest.splice(index, 1);
            }

                // Remove from watch list       
            else {
                var thisRoom = vm.user.rooms.watch[index];
                vm.user.rooms.rest.push(thisRoom)
                vm.user.rooms.watch.splice(index, 1);
            }

            $sessionStorage.user.rooms.watch = vm.user.rooms.watch;
            $sessionStorage.user.rooms.rest = vm.user.rooms.rest;    
        }



    }



})();