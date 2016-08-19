
(function () {
    'use strict';

    angular
        .module('app.common')
        .component('cpDashboard', {
            templateUrl: "/app/common/components/cp-dashboard/cp-dashboard.component.html",
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
