
(function () {
    'use strict';

    angular
        .module('app.rooms')
        .component('cpIcons', {
            templateUrl: "/app/rooms/components/cp-icons/cp-icons.component.html",
            bindings: {
                criticalPoint: '<',
                criticalPointIndex: '<',
                cpIdle: '<',


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
        vm.cpTypeChangerShorts = cpTypeChangerShorts;

        this.$onInit = function () {
            console.log();
        };

        function cpTypeChanger(cp) {
            if (cp == 13)
                return 'DS';
            
            if (cp == 14)
                return 'תשובה נכונה';

            if (cp == 15)
                return 'תשובה שגויה';
            
            if (cp == 16)
                return 'שיח לא מתמטי';

            if (cp == 17)
                return 'טכני';

            if (cp == 'idle')
                return 'אין פעילות';
        }

        function cpTypeChangerShorts(cp) {
            if (cp == 13)
                return 'DS';

            if (cp == 14)
                return 'CDS';

            if (cp == 15)
                return 'WDS';

            if (cp == 16)
                return 'NMD';

            if (cp == 17)
                return 'TEC';

            if (cp == 'idle')
                return 'IDL';
        }
        
        
    }
})();
