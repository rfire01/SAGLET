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

        // vm.fullView800plus = true;


        vm.scaledInit = true;
        vm.hide = false;
        vm.newCriticalPoints = [];
        vm.oldCriticalPoints = [];
        vm.criticalPointsMessages = [];
        vm.criticalPointsForRoomBoxToolbar = [];
        vm.idleness = [];
        //vm.newcp = false;
        vm.newCpBorderAlertType = 'none';
        vm.criticalPointsIndex = [];



        //in methods
        vm.iframeLink = iframeLink;
        vm.openCloseFullView = openCloseFullView;
        vm.getScaledRules = getScaledRules;

        //out methods
        this.setFullView = setFullView;
        this.setHide = setHide;
        this.setCriticalPointMessages = setCriticalPointMessages;
        //this.setIdleness = setIdleness;

        this.$onInit = function () {

            this.parent.addRoom(this);

            loadLastSession();

            var initScaledIframe = $timeout(function () {
                vm.scaledInit = false;
                console.info("***** scale " + vm.scaledInit + " ****");
            }, 10000);
        }

        this.$onChanges = function (changes) {

            console.log(changes);
        }
        this.$onDestroy = function () {

            saveLastSession();
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
            if (!vm.fullView)
                this.parent.openFullViewSelectedRoom(this);
            else {
                this.parent.closeFullViewSelectedRoom(this);


                vm.newCriticalPoints.forEach(function (cp) {
                    vm.oldCriticalPoints.push(cp);
                })

                vm.newCriticalPoints = [];
                vm.newCpBorderAlertType = 'none'
            }


            //if (vm.newcp)
            //    vm.newcp = !vm.newcp;



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
                vm.newCriticalPoints.push(cp);
                vm.newCpBorderAlertType = cpType;
            }



            saveLastSession();
        }
        //function setIdleness(idle) {
        //    vm.idleness = idle;

        //    if (vm.idleness.length > 0)
        //        vm.cpAlertIdleType = 'idle';
        //    else
        //        vm.cpAlertIdleType = '';


        //    vm.newcp = true;
        //    vm.newCpBorderAlertType = 'idle';


        //    var cpIdle = { cpType: 'idle', idleUsers: idle }
        //    vm.newCriticalPoints.push(cpIdle);

        //    console.log(vm.idleness);
        //    console.log(vm.cpAlertIdleType);

        //    //saveLastSession();
        //}
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
