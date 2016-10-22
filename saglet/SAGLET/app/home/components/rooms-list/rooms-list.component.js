(function () {
    'use strict';

    angular
        .module('app.home')
        .component('roomsList', {
            templateUrl: "/app/home/components/rooms-list/rooms-list.component.html",
            bindings: {
                rooms: '<',
                watch: '<',
                onStatusChange: '&',
                isFull: '<'
            },
            controllerAs: 'vm',
            controller: controller
        })

    function controller() {
        var vm = this;
        
        vm.changeWatchStatus = changeWatchStatus;
        vm.clickedIndex;

        this.$onInit = function () {};
       
        /* Move room from rooms list to watch list or vice versa*/
        function changeWatchStatus(_index) {
            vm.clickedIndex = _index;
            vm.onStatusChange({ index: _index, status: vm.watch });
        }
    }
})();
