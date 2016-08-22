
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
            return [{ cpType: '13', desc: 'Direct solution' }, { cpType: '14', desc: 'None mathematical conversation' }, { cpType: '15', desc: 'Technical conversation' }]
        }
        
        
    }
})();
