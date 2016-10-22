(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('roomBox', {
            templateUrl: 'app/rooms/components/room-box/room-box.component.html',
            bindings: {
                room: '<',
                overview: '<',
                screenWidthHeight: '<'
            },
            require: {
                "parent": "^roomsOverview"
            },
            controllerAs: 'vm',
            controller: ['$sce', '$window', '$sessionStorage', '$timeout', controller]
        })

    function controller($sce, $window, $sessionStorage, $timeout) {
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
        //vm.newcp = false;
        vm.newCpBorderAlertType = 'none';
        vm.criticalPointsIndex = [];
        vm.width = $window.innerWidth;
        vm.height = $window.innerHeight / 0.74;
        vm.cpPanel = false;

        //in methods
        vm.iframeLink = iframeLink;
        vm.openCloseFullView = openCloseFullView;
        vm.iframeLoaded = iframeLoaded;

        //out methods
        this.setFullView = setFullView;
        this.setHide = setHide;
        this.setCriticalPointMessages = setCriticalPointMessages;
        //this.setIdleness = setIdleness;

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

        function iframeLoaded() {
            vm.height += 300;
        }

        function iframeLink(_index) {
            var u = "http://vmtdev.mathforum.org/#/room/";
            var r = _index;
            var l = '?autoload=true';
            var url = u + r + l;

            return $sce.trustAsResourceUrl(url);
            //$sce.trustAsResourceUrl("http://vmtdev.mathforum.org/#/room/' + {{vm.room.ID}} )
        }

        function openCloseFullView() {
            if (!vm.fullView) {
                this.parent.openFullViewSelectedRoom(this);
                vm.jumpFix = false;
            }  else {
                this.parent.closeFullViewSelectedRoom(this);

                vm.newCriticalPoints.forEach(function (cp) {
                    vm.oldCriticalPoints.push(cp);
                })

                vm.newCriticalPoints = [];
                vm.newCpBorderAlertType = 'none'
                vm.cpPanel = false;

                vm.jumpFix = true;
                $timeout(function () {
                    vm.jumpFix = false;
                }, 50);
            }
        }

        function setFullView(bool) {
            vm.fullView = bool;
        }

        function setHide(bool) {
            vm.hide = bool;
        }

        function setCriticalPointMessages(cpType, cpMsg, cpUser, cpTime, cpPriority, cpAlertType) {
            //console.log(cpType);
            //console.log(cpMsg);
            //console.log(cpAlertType);

            var cp = {
                cpUser: cpUser,
                cpMsg: cpMsg,
                cpType: cpType,
                cpPriority: cpPriority,
                cpTime: cpTime,
                cpAlertType: cpAlertType,
                cpCount: false
            };

            //vm.newcp = true;

            vm.criticalPointsMessages.push(cp);

            if (cpAlertType > 0) {
                vm.cpPanel = true;
                vm.newCriticalPoints.push(cp);
                vm.newCpBorderAlertType = cpType;
            }

            saveLastSession();
        }

        function saveLastSession() {
            var roomObj = { id: vm.room.ID, cp: vm.criticalPoints, cpMessages: vm.criticalPointsMessages, idleness: vm.idleness };

            var roomIndex = getRoomObjectIndex($sessionStorage.rooms, vm.room.ID);

            if (roomIndex < 0)
                $sessionStorage.rooms.push(roomObj);
            else
                $sessionStorage.rooms[roomIndex] = roomObj;
        }

        function loadLastSession() {
            var roomIndex = getRoomObjectIndex($sessionStorage.rooms, vm.room.ID);

            if (roomIndex >= 0)
                vm.criticalPoints = $sessionStorage.rooms[roomIndex].cp
        }

        function getRoomObjectIndex(rooms, id) {
            var index = -1;

            rooms.forEach(function (room, i) {
                if (room.id == id) {
                    index = i;
                }
            })

            return index;
        }

        function getScaledRules(screenRes) {
            var rules = '';

            if (screenRes == '1600x900')
                return
        }
    }
})();
