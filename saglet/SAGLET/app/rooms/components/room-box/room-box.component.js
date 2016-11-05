(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('roomBox', {
            templateUrl: 'app/rooms/components/room-box/room-box.component.html',
            bindings: {
                room: '<',
                overview: '<'
            },
            require: {
                "parent": "^roomsOverview"
            },
            controllerAs: 'vm',
            controller: ['$sce', '$window', '$sessionStorage', '$timeout', '$interval', controller]
        })

    function controller($sce, $window, $sessionStorage, $timeout, $interval) {
        var vm = this;

        var criticalPointsTenLastMessages = [];

        //props
        vm.fullView = false;
        vm.hide = false;
        vm.jumpFix = false;
        vm.newCriticalPoints = [];
        vm.oldCriticalPoints = [];
        vm.criticalPointsMessages = [];
        vm.criticalPointsForRoomBoxToolbar = [];
        vm.idleness = [];
        vm.newCpBorderAlertType = 'none';
        vm.criticalPointsIndex = [];
        vm.width = $window.innerWidth;
        vm.height = $window.innerHeight / 0.74;
        vm.cpPanel = false;

        //in methods
        vm.iframeLink = iframeLink;
        vm.openCloseFullView = openCloseFullView;
        vm.iframeLoaded = iframeLoaded;
        vm.jumpFixer = jumpFixer;

        //out methods
        this.setFullView = setFullView;
        this.setHide = setHide;
        this.setCriticalPointMessages = setCriticalPointMessages;

        this.$onInit = function () {
            this.parent.addRoom(this);
            loadLastSession();
        }

        this.$onChanges = function (changes) {
            console.log(changes);
        }

        this.$onDestroy = function () {
            saveLastSession();
        }

        /* iframe loaded event */
        function iframeLoaded() {
            vm.height += 300;
        }

        /* generates the link corresponding to to room */
        function iframeLink(_index) {
            var u = "http://vmtdev.mathforum.org/#/room/";
            var r = _index;
            var l = '?autoload=true';
            var url = u + r + l;

            return $sce.trustAsResourceUrl(url);
        }

        /* fixes VMT jump when taking control and performing action (not happening in new version!) */
        function jumpFixer() {
            //if (vm.cpPanel && vm.fullView) {
            //    vm.jumpFix = true;
            //    $timeout(function () {
            //        vm.jumpFix = false;
            //    }, 50);
            //}
        }

        /* change fullview to overview and vice versa */
        function openCloseFullView() {
            if (!vm.fullView) {
                this.parent.openFullViewSelectedRoom(this);
            }  else {
                this.parent.closeFullViewSelectedRoom(this);

                vm.newCriticalPoints.forEach(function (cp) {
                    vm.oldCriticalPoints.push(cp);
                });

                vm.newCriticalPoints = [];
                vm.newCpBorderAlertType = 'none';
                vm.cpPanel = false;
            }
        }

        /* set fullview field */
        function setFullView(bool) {
            vm.fullView = bool;
        }

        /* set hide field */
        function setHide(bool) {
            vm.hide = bool;
        }

        /* add critical point to list and display on panel if should be alerted */
        function setCriticalPointMessages(cpType, cpMsg, cpUser, cpTime, cpPriority, cpAlertType) {
            var cp = {
                cpUser: cpUser,
                cpMsg: cpMsg,
                cpType: cpType,
                cpPriority: cpPriority,
                cpTime: cpTime,
                cpAlertType: cpAlertType,
                cpCount: false
            };

            vm.criticalPointsMessages.push(cp);

            if (cpAlertType > 0) {
                vm.cpPanel = true;
                vm.newCriticalPoints.push(cp);
                vm.newCpBorderAlertType = cpType;
            }

            saveLastSession();
        }

        /* save the current session */
        function saveLastSession() {
            var roomObj = { id: vm.room.ID, cp: vm.criticalPoints, cpMessages: vm.criticalPointsMessages, idleness: vm.idleness };
            var roomIndex = getRoomObjectIndex($sessionStorage.rooms, vm.room.ID);

            if (roomIndex < 0)
                $sessionStorage.rooms.push(roomObj);
            else
                $sessionStorage.rooms[roomIndex] = roomObj;
        }

        /* restore last session, if any */
        function loadLastSession() {
            var roomIndex = getRoomObjectIndex($sessionStorage.rooms, vm.room.ID);

            if (roomIndex >= 0)
                vm.criticalPoints = $sessionStorage.rooms[roomIndex].cp
        }

        /* return the index of a room by id, in rooms list*/
        function getRoomObjectIndex(rooms, id) {
            var index = -1;

            rooms.forEach(function (room, i) {
                if (room.id == id)
                    index = i;
            });

            return index;
        }
    }
})();
