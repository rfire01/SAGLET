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
        vm.cp = {
            newcp: false,
            cp1: false,
            cp2: false,
            cp3: false,
            cp4: false,
            cp5: false
        };
        
        //in methods
        vm.iframeLink = iframeLink;
        vm.openCloseFullView = openCloseFullView;
        
        
        //out methods
        this.setFullView = setFullView;
        this.setHide = setHide;
        this.setCriticalPoint = setCriticalPoint;
        this.$onInit = function () {
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

                if (vm.cp.newcp)
                    vm.cp.newcp = !vm.cp.newcp;
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
        function setCriticalPoint(cp) {
            
            vm.cp.newcp = true;

            // just for chekcing
            if (cp == '1')
                vm.cp.cp1 = true;
            if (cp == '2')
                vm.cp.cp2 = true;
            if (cp == '3')
                vm.cp.cp3 = true;
            if (cp == '4')
                vm.cp.cp4 = true;
            if (cp == '5')
                vm.cp.cp5 = true;
        }
        
    }
})();
