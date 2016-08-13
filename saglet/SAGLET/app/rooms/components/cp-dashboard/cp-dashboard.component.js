
(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('cpDashboard', {
            templateUrl: "/app/rooms/components/cp-dashboard/cp-dashboard.component.html",
            bindings: {
                title: "<"
            },
            controllerAs: 'vm',
            controller: controller
        })


    function controller() {
        var vm = this;

        
        

        this.$onInit = function () {};

       
        
        
    }
})();
