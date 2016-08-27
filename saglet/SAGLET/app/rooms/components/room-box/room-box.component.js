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
        vm.criticalPoints = [];
        vm.criticalPointsMessages = [];
        vm.criticalPointsForRoomBoxToolbar = [];
        vm.idleness = [];
        vm.newCp = false;
        vm.criticalPointsIndex = [];
        


        //in methods
        vm.iframeLink = iframeLink;
        vm.openCloseFullView = openCloseFullView;
        vm.getScaledRules = getScaledRules;
        
        //out methods
        this.setFullView = setFullView;
        this.setHide = setHide;
        this.setCriticalPointMessages = setCriticalPointMessages;
        this.setIdleness = setIdleness;
        
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
        function setCriticalPointMessages(cpType, cpMsg, cpUser, cpTime, cpPriority) {
            var cp = {
                cpUser: cpUser,
                cpMsg: cpMsg,
                cpType: cpType,
                cpPriority: cpPriority,
                cpTime: cpTime,
                cpCount: false
            };
            

            
            vm.criticalPointsMessages.push(cp);
            updateCriticalPointsTenLastMessages(cp);
            //criticalPointsAlert(vm.criticalPointsMessages)
            saveLastSession();
        }
        function setIdleness(idel) {
            vm.idleness = idel;
            console.log(vm.idleness);
            saveLastSession();
        }
        function saveLastSession() {
            
            var roomObj = { id: vm.room.ID, cp:vm.criticalPoints, cpMessages: vm.criticalPointsMessages, idleness: vm.idleness };

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

        function criticalPointsAlert(cpMessages) {

            var cp = {
                cpType: '',
                cpMessages: [],
            }

            var nmdMessages = [];
            var nmdCounter = 0;

            var ds = [];
            var tec = [];

            
            
            var counter = 0;
            for (var i = cpMessages.length - 1; counter < 11; i--) {
                counter++;

                if (!cpMessages[i].cpCount) {

                    vm.criticalPointsMessages[i].cpCount = true;

                    if (cpMessages[i].cpType == 16) {
                        nmdCounter++;

                       

                    }
                        
                    if (cpMessages[i].cpType == 17)
                        tec.push(cpMessages[i])
                    if (cpMessages[i].cpType == 13)
                        ds.push(cpMessages[i])

                }
                


            }
            console.log('nmd', nmd.length);
            console.log('tec', tec.length)
            console.log('ds', ds.length)

            if (nmd.length > 5) {
                cp.cpType = "NMD";
                cp.cpMessages = nmd;
                vm.criticalPoints.push(cp);
            }

            if (tec.length > 8) {
                cp.cpType = "TEC";
                cp.cpMessages = nmd;
                vm.criticalPoints.push(cp);
            }

            if (ds.length > 8) {
                cp.cpType = "DS";
                cp.cpMessages = ds;
                vm.criticalPoints.push(cp);
            }


            


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

        function updateCriticalPointsTenLastMessages(cpMsg) {
            
            if(criticalPointsTenLastMessages.length >= 10)
                criticalPointsTenLastMessages.splice(0, 1)

            criticalPointsTenLastMessages.push(cpMsg)


            var cp = {
                cpType: '',
                cpMessages: [],
            }

            var nmd = [];
            var tec = [];
            var ds = [];
            criticalPointsTenLastMessages.forEach(function (cp,i) {
                if (cp.cpType == 16) 
                    nmd.push(i);
                
                if (cp.cpType == 17)
                    tec.push(i);

                if (cp.cpType == 16)
                    ds.push(i);
            })

            if (nmd.length > 5) {
                cp.cpType = 16;
                nmd.forEach(function (i) {
                    cp.cpMessages.push(criticalPointsTenLastMessages[i]);
           
                })
                vm.criticalPoints.push(cp);

                nmd.forEach(function (i) {
                    criticalPointsTenLastMessages.splice(i, 1);
                })
                vm.newcp = true;

                
            }

            if (tec.length > 8) {
                cp.cpType = 17;
                tec.forEach(function (i) {
                    cp.cpMessages.push(criticalPointsTenLastMessages[i]);

                })
                vm.criticalPoints.push(cp);

                tec.forEach(function (i) {
                    criticalPointsTenLastMessages.splice(i, 1);
                })
                vm.newcp = true;
            }

            if (ds.length > 8) {
                cp.cpType = 17;
                ds.forEach(function (i) {
                    cp.cpMessages.push(criticalPointsTenLastMessages[i]);

                })
                vm.criticalPoints.push(cp);

                ds.forEach(function (i) {
                    criticalPointsTenLastMessages.splice(i, 1);
                })
                vm.newcp = true;
            }

        }
       

    }
})();
