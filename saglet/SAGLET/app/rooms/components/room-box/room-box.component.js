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
            controller: ['$sce', controller]
        })

    function controller($sce) {
        var vm = this;
        

        //props
        vm.fullView = false;
        vm.hide = false;

        
        //in methods
        vm.iframeLink = iframeLink;
        vm.openCloseFullView = openCloseFullView;
        
        
        //out methods
        this.setFullView = setFullView;
        this.setHide = setHide;

        this.$onInit = function () {
            this.parent.addRoom(this);
            console.log(vm.overview);
            console.log(vm.fullView);
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
                
            }
                
        }
        

        
        function setFullView(bool) {
            vm.fullView = bool;
           
        }

        
        function setHide(bool) {
            vm.hide = bool;
        }

        
    }
})();
