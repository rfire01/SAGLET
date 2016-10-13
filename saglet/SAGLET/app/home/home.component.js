(function () {
    'use strict';

    angular
        .module('app.home')
        .constant('$', window.jQuery)
        .component('homeComponent', {
            templateUrl: "app/home/home.component.html",
            controllerAs: "vm",
            controller: ['$', '$q', '$sessionStorage', 'shareData', controller]
        });

    function controller($, $q, $sessionStorage, shareData) {
        var vm = this;
        
        var indexHub = $.connection.roomIndexHub;
        vm.loader = true;
        vm.full = false;
        vm.maxRooms = 8;

        vm.user = {
            user: '',
            rooms: { watch: [], rest: [] }
        };

        vm.changeWatchStatus = changeWatchStatus;
        vm.updateRooms = updateRooms;
        //vm.test = function () {
        //    $.connection.hub.stop();
        //}

        this.$onInit = function () {
            $.connection.hub.logging = true;

            /* Hub Start */
            $.connection.hub.start().done(function () {
                console.info(" ** hub started ** ");
                indexHub.server.getUserName();
                vm.loader = false;
                //indexHub.server.getRooms();
            });
            
            if ($sessionStorage.user.rooms != null && $sessionStorage.user.rooms.watch.length == vm.maxRooms) {
                vm.full = true;
            }
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
                var i = 0;

                if (!$sessionStorage.user.rooms && vm.user.rooms.watch.length == 0 && vm.user.rooms.rest.length == 0 && list.length > 0)
                    rest = list;

                if ($sessionStorage.user.rooms && $sessionStorage.user.rooms.watch.length + $sessionStorage.user.rooms.rest.length < list.length) {
                    list.forEach(function (room) {
                        var exists = false;
                        for (i = 0; i < $sessionStorage.user.rooms.watch.length; i++) {
                            if ($sessionStorage.user.rooms.watch[i].ID == room.ID)
                                exists = true;
                        }
                        for (i = 0; i < $sessionStorage.user.rooms.rest.length; i++) {
                            if ($sessionStorage.user.rooms.rest[i].ID == room.ID)
                                exists = true;
                        }
                        if (!exists)
                            $sessionStorage.user.rooms.rest.push(room)
                    })
                }

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
            if (!status && vm.user.rooms.watch.length == vm.maxRooms - 1) {
                vm.full = true;
            } else if (!status && vm.user.rooms.watch.length >= vm.maxRooms) {
                alert('You are allowed to choose up to 8 rooms.');
                return;
            }
            
            if (!status) { // Add to watch list
                var thisRoom = vm.user.rooms.rest[index];
                vm.user.rooms.watch.push(thisRoom)
                vm.user.rooms.rest.splice(index, 1);
            } else { // Remove from watch list
                if (vm.full)
                    vm.full = false;
                var thisRoom = vm.user.rooms.watch[index];
                vm.user.rooms.rest.push(thisRoom)
                vm.user.rooms.watch.splice(index, 1);
            }

            $sessionStorage.user.rooms.watch = vm.user.rooms.watch;
            $sessionStorage.user.rooms.rest = vm.user.rooms.rest;    
        }

        function updateRooms() {
            indexHub.server.updateRooms();
        }
    }
})();