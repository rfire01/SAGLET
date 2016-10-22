describe('Component: homeComponent', function () {
    beforeEach(module('app.home'));

    var element;
    var scope;
    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        element = angular.element('<home-component></home-component>');
        element = $compile(element)(scope);
        scope.user = '1.5';
        scope.$apply();
    }));

    it('should render the text', function () {
        var h1 = element.find('h1');
        expect(h1.text()).toBe('Unit Testing AngularJS 1.5');
    });
});