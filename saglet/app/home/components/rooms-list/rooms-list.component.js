(function () {
    'use strict';

    angular
        .module('app.home')
        .component('roomsList', {
            templateUrl: "/app/home/components/rooms-list/rooms-list.component.html",
            bindings: {
                rooms: '<',
                watch: '<',
                onStatusChange: '&'
            },
            controllerAs: 'vm',
            controller: controller
        })


    function controller() {
        var vm = this;

        
        vm.changeWatchStatus = changeWatchStatus;
        vm.clickedIndex;

        this.$onInit = function () {};

       
        
        function changeWatchStatus(_index) {
            vm.clickedIndex = _index;

            vm.onStatusChange({ index: _index, status: vm.watch });
        }
        //this.$onChanges = function (changesObj) {
        //    if (changesObj.rooms) {
        //        console.log(changesObj);
        //        this.rooms = changesObj.rooms;
        //    }
        //};
    }
})();
