
(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('cpIcons', {
            templateUrl: "/app/rooms/components/cp-icons/cp-icons.component.html",
            bindings: {
                criticalPoints: '<',
                dashboard: '<',
                fullView: '<'
                
                
            },
            controllerAs: 'vm',
            controller: controller
        })


    function controller() {
        var vm = this;

        
        vm.cpTypeChanger = cpTypeChanger;

        this.$onInit = function () {};

        function cpTypeChanger(cp) {
            if (cp == 13)
                return 'DS';
                
            if (cp == 14)
                return 'MND';

            if (cp == 15)
                return 'TEC';
        }
        
        
    }
})();
