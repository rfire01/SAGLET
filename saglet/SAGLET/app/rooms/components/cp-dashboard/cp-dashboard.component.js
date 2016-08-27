
(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('cpDashboard', {
            templateUrl: "/app/rooms/components/cp-dashboard/cp-dashboard.component.html",
            bindings: {
                criticalPoints: "<",
                criticalPointsMessages: "<",
                criticalPointsIdleness: "<"
            },
            controllerAs: 'vm',
            controller: controller
        })


    function controller() {
        var vm = this;

        vm.dashboard = '';
        vm.idleForCpIcons = {};
        vm.criticalPointsIndex = [];
        

        this.$onInit = function () {
            vm.dashboard = true;

            vm.idleForCpIcons = {cpType: 'idle'} 
            vm.criticalPointsIndex = setCriticalPointsIndex();
            console.log(vm.criticalPointsIdleness);
        };

        function setCriticalPointsIndex() {
            return [    { cpType: '13', desc: 'Direct solution' },
                        { cpType: '16', desc: 'None mathematical conversation' },
                        { cpType: '17', desc: 'Technical conversation' },
                        { cpType: 'idle', desc: 'Idleness - user is inactive' }
                  ]
        }

        
        
    }
})();
