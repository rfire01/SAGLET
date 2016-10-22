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
        

        this.$onInit = function () {
            $.connection.hub.logging = true;

            /* Hub Start */
            $.connection.hub.start().done(function () {
                console.info(" ** hub started ** ");
                indexHub.server.getUserName();
                vm.loader = false;
            });
            
            /* If max number of rooms chosen saved in session, then forbid choosing more */
            if ($sessionStorage.user != null && $sessionStorage.user.rooms != null && $sessionStorage.user.rooms.watch.length == vm.maxRooms) {
                vm.full = true;
            }
        }

        /* Stop Hub */
        this.$onDestroy = function () {
            $.connection.hub.stop();
        }

        /* GetUserName Listner */
        indexHub.client.getUserName = function (user) {
            console.info(" ** getUserName ** ");
            returnUser(user)
                .then(function (_userName) {
                    vm.user.user = _userName;

                    indexHub.server.getRooms();
                    console.log(" ** User: " + vm.user.user);
                })
        };

        /* GetRooms Listner */
        indexHub.client.getRooms = function (roomList) {
            console.info(" ** getRooms ** ");
            returnRooms(roomList)
                .then(function (prop) {
                    vm.user.rooms.watch = prop.watch;
                    vm.user.rooms.rest = prop.rest;

                    $sessionStorage.user = vm.user;
                })
        };

        /* Hub on connect */
        indexHub.client.registeredComplete = function (msg) {
            console.info(msg);
        }

        /* Async task that gets the Saglet User, and updates the session storage if needed */
        function returnUser(user) {
            return $q(function (resolve, reject) {
                var name = user;

                if (!$sessionStorage.user || $sessionStorage.user.user != name)
                    $sessionStorage.user = {};

                resolve(name);
            });
        }

        /* Async task that gets the list of rooms, and updates the view and the session storage if needed */
        function returnRooms(list) {
            return $q(function (resolve, reject) {
                var watch = [];
                var rest = [];
                var i = 0;

                // if session is new and there are no rooms in lists
                if (!$sessionStorage.user.rooms && vm.user.rooms.watch.length == 0 && vm.user.rooms.rest.length == 0 && list.length > 0)
                    rest = list;

                // check if new rooms where added 
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

                // restore watch list and rooms list status from session, if exists
                if ($sessionStorage.user.rooms) {
                    list.forEach(function (room) {
                        checkLastRoomStatus(room.ID)
                            .then(function (status) {
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

        /* returns the last status (rest or watch) of a room from session, if existed */
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

        /* Move room from rooms list to watch list or vice versa*/
        function changeWatchStatus(index, status) {
            if (!status && vm.user.rooms.watch.length == vm.maxRooms - 1) {
                vm.full = true;
            } else if (!status && vm.user.rooms.watch.length >= vm.maxRooms) {
                alert('You are allowed to choose up to 8 rooms.');
                return;
            }
            
            if (!status) {
                // Add to watch list
                var thisRoom = vm.user.rooms.rest[index];
                vm.user.rooms.watch.push(thisRoom)
                vm.user.rooms.rest.splice(index, 1);
            } else {
                // Remove from watch list
                if (vm.full) vm.full = false;
                var thisRoom = vm.user.rooms.watch[index];
                vm.user.rooms.rest.push(thisRoom)
                vm.user.rooms.watch.splice(index, 1);
            }

            $sessionStorage.user.rooms.watch = vm.user.rooms.watch;
            $sessionStorage.user.rooms.rest = vm.user.rooms.rest;    
        }

        /* Asks the server for rooms update */
        function updateRooms() {
            indexHub.server.updateRooms();
        }
    }
})();