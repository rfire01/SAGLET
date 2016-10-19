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

    angular.module('app.home').filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                  if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });

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
