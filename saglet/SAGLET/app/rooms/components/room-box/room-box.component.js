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
        

        //props
        vm.fullView = false;
       // vm.fullView800plus = true;
        

        vm.scaledInit = true;
        vm.hide = false;
        vm.criticalPoints = [];
        vm.newCp = false;
        vm.criticalPointsIndex = [];
        


        //in methods
        vm.iframeLink = iframeLink;
        vm.openCloseFullView = openCloseFullView;
        vm.getScaledRules = getScaledRules;
        
        //out methods
        this.setFullView = setFullView;
        this.setHide = setHide;
        this.setCriticalPoint = setCriticalPoint;
        
        
        this.$onInit = function () {
            
            //var cp = {
            //    cpUser: 'test',
            //    cpMsg: 'test',
            //    cpType: '15',
            //    cpPriority: '1',
            //    cpTime: '12:00:11'
            //};
            //vm.criticalPoints.push(cp)

            this.parent.addRoom(this);
            
            loadLastSession();
           


           
            
            var initScaledIframe = $timeout(function () {
                vm.scaledInit = false;
                console.info("***** scale " + vm.scaledInit + " ****");
            }, 10000);


           
            
            

            
        }
        
        this.$onChanges = function (changes) { }
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
            if (!vm.fullView){
                this.parent.openFullViewSelectedRoom(this);

                if (vm.newcp)
                    vm.newcp = !vm.newcp;
            }
                
            else {
                this.parent.closeFullViewSelectedRoom(this);
                
            }
                
        }
        

        
        function setFullView(bool) {
            vm.fullView = bool;
           
        }

        
        function setHide(bool) {
            vm.hide = bool;
        }
        function setCriticalPoint(cpMsg, cpType, cpUser, cpTime, cpPriority) {
            var cp = {
                cpUser: cpUser,
                cpMsg: cpMsg,
                cpType: cpType,
                cpPriority: cpPriority,
                cpTime: cpTime
            };
            vm.newcp = true;

            
            vm.criticalPoints.push(cp);
            saveLastSession();
        }

        function saveLastSession() {
            
            var roomObj = { id: vm.room.ID, cp: vm.criticalPoints };

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
