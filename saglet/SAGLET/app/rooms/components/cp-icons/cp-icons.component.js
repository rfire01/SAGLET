
(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('cpIcons', {
            templateUrl: "/app/rooms/components/cp-icons/cp-icons.component.html",
            bindings: {
                criticalPoint: '<',
                criticalPointIndex: '<',
                

                criticalPoints: '<',
                dashboard: '<',
                fullView: '<',
                cpIdle: '<'
                
            },
            controllerAs: 'vm',
            controller: controller
        })


    function controller() {
        var vm = this;

        
        vm.cpTypeChanger = cpTypeChanger;

        this.$onInit = function () {
            console.log();
        };

        function cpTypeChanger(cp) {
            if (cp == 13)
                return 'DS';
                
            if (cp == 16)
                return 'NMD';

            if (cp == 17)
                return 'TEC';

            if (cp == 'idle')
                return 'idle';
        }
        
        
    }
})();
