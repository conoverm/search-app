describe('Controller: LoginCtrl', function() {
  'use strict';

  // load the controller's module
  beforeEach(module('ts-id-lookup'));

  var LoginCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();

    LoginCtrl = $controller('LoginController', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(LoginCtrl).toBeDefined();
    expect(scope.login).toBeDefined();
  });
});
