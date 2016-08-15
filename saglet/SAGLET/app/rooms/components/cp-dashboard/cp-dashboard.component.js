
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
        
        

        this.$onInit = function () {
            vm.dashboard = true;
        };

       
        
        
    }
})();
