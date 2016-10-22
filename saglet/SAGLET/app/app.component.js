(function () {
    'use strict';

    angular
        .module('app')
        .component('appComponent', {
            template: `
                <div ng-view></div>
                `
        });
})();
