(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('cpDashboard', {
            templateUrl: "/app/rooms/components/cp-dashboard/cp-dashboard.component.html",
            bindings: {
                newCriticalPoints: "<",
                oldCriticalPoints: "<",
                criticalPointsMessages: "<",
                criticalPointsIdleness: "<",
                tagHeight: "<"
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
            console.log(vm.criticalPointsIdleness);
        };
    }
})();
