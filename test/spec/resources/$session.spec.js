describe('$session resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $session;

  beforeEach(inject(function($injector) {
    $session = $injector.get('$session');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));


  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$session resource should exist', function () {
    expect(typeof $session).toBe('function');
  });

  it('$session resource respond with session data', function (){

    var fixture = window.__mocks__['mocks/loginSuccess'];
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase + '/session').respond(fixture);


    $session.get().$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(fixture.data);

  });

});
