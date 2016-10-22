(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('cpIndex', {
            templateUrl: "/app/rooms/components/cp-index/cp-index.component.html",
            bindings: {},
            controllerAs: 'vm',
            controller: controller
        })

    function controller() {
        var vm = this;
       
        this.$onInit = function () {};
    }
})();
