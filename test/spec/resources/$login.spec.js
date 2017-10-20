describe('$login resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, $httpParamSerializerJQLike, T1URL, T1ApiBase, $httpBackend;
  var $login;

  beforeEach(inject(function($injector) {
    $login = $injector.get('$login');
    $resource = $injector.get('$resource');
    $httpParamSerializerJQLike = $injector.get('$httpParamSerializerJQLike');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));


  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('Login resource should have method \'login\'', function () {
    expect(typeof $login.login).toBe('function');
  });

  it('Login resource respond with login data', function(){

    $httpBackend.expectPOST(T1URL + T1ApiBase + '/login').respond({data: 'pants!'});

    var result;
    var loginData = {
      'user': 'mc',
      'password': 'massivesecret',
    };

    $login.login(loginData)
    .$promise
    .then(function(response) {
      result = response.data;
    });

    $httpBackend.flush();

    expect(result).toBe('pants!');

  });

});
