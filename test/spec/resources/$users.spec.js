describe('$users resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $users;

  beforeEach(inject(function($injector) {
    $users = $injector.get('$users');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));


  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$users resource should exist', function () {
    expect(typeof $users).toBe('function');
  });

  it('$users resource respond with user data', function (){

    var fixture = window.__mocks__['mocks/user8415'];
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase + '/users/8415').respond(fixture);

    $users.get({'userID':8415}).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(fixture.data);

  });

});
