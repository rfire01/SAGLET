(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('roomBox', {
            templateUrl: 'app/rooms/components/room-box/room-box.component.html',
            bindings: {
                room: '<',
                overview: '<',
                screenWidth: '<'
                
            },
            require: {
                "parent": "^roomsOverview"
            },
            controllerAs: 'vm',
            controller: ['$sce','$window', controller]
        })

    function controller($sce, $window) {
        var vm = this;
        

        //props
        vm.fullView = false;
        vm.fullView800plus = true;

        vm.hide = false;
        vm.criticalPoints = [];
        vm.newCp = false;
        
        //in methods
        vm.iframeLink = iframeLink;
        vm.openCloseFullView = openCloseFullView;
        
        
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

            //var cp = {
            //    cpUser: 'test2',
            //    cpMsg: 'test2',
            //    cpType: '13',
            //    cpPriority: '2',
            //    cpTime: '12:00:15'
            //};
            //vm.criticalPoints.push(cp)

            //var cp = {
            //    cpUser: 'test3',
            //    cpMsg: 'test3',
            //    cpType: '14',
            //    cpPriority: '3',
            //    cpTime: '12:00:44'
            //};
            //vm.criticalPoints.push(cp)

            console.log(vm.criticalPoints);
            this.parent.addRoom(this);
            
            if (vm.screenWidth > 800)
                vm.fullView800plus = true;
            else {
                vm.fullView800plus = false;
            }
            
            
        }

        this.$onChanges = function (changes) {
            console.log("** room-box changes **");
            console.log(changes);
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

            // just for chekcing
            vm.criticalPoints.push(cp);
        }
        
    }
})();
