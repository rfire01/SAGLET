
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


        vm.currentDate = currentDate;
        
        vm.dashboard = '';
        vm.idleForCpIcons = {};
        vm.criticalPointsIndex = [];
        

        this.$onInit = function () {
            vm.dashboard = true;

            //vm.idleForCpIcons = {cpType: 'idle'} 
            //vm.criticalPointsIndex = setCriticalPointsIndex();

            console.log(vm.criticalPointsIdleness);
        };

        //function setCriticalPointsIndex() {
        //    return [    { cpType: '14', desc: 'Correct solution' },
        //                { cpType: '15', desc: 'Wrong solution' },
        //                { cpType: '16', desc: 'None mathematical conversation' },
        //                { cpType: '17', desc: 'Technical conversation' },
        //                { cpType: 'idle', desc: 'Idleness - user is inactive' }
        //          ]
        //}
        function currentDate() {
            //var time = new Date();

            //return (time.getUTCHours() + ":" + time.getUTCMinutes() + ":" + time.getUTCSeconds())
            return new Date().toLocaleTimeString();
        }
        
    }
})();
