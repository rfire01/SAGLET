
(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('cpDashboard', {
            templateUrl: "/app/rooms/components/cp-dashboard/cp-dashboard.component.html",
            bindings: {
                criticalPoints: "<"
              
            },
            controllerAs: 'vm',
            controller: controller
        })


    function controller() {
        var vm = this;

        vm.dashboard = '';
        vm.criticalPointsIndex = [];
        

        this.$onInit = function () {
            vm.dashboard = true;

            vm.criticalPointsIndex = setCriticalPointsIndex();
            
        };

        function setCriticalPointsIndex() {
            return [{ cpType: '13', desc: 'description for 13' }, { cpType: '14', desc: 'description for 14' }, { cpType: '15', desc: 'description for 15' }]
        }
        
        
    }
})();
