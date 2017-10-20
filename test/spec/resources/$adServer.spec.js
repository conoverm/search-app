describe('$adServer resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $adServer, adServerFixture;

  beforeEach(inject(function($injector) {
    $adServer = $injector.get('$adServer');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    adServerFixture = __mocks__['mocks/adServers'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$adServer resource should exist', function () {
    expect(typeof $adServer).toBe('function');
  });

  it('should respond fetch adServer data', function (){

    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/ad_servers?order_by=descending&page_limit=50&page_offset=0')
    .respond(adServerFixture);

    $adServer.get().$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(adServerFixture.data);

  });

  it('$adServer.query() request should have default params', function (){

    var query = { substringQuery: 'stuff & things' };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
      '/ad_servers?order_by=descending&page_limit=50&page_offset=0&q=%3Cstuff%2520%2526%2520things%3E')
      .respond(adServerFixture);

    $adServer.query({ entityEndpoint: query.entityEndpoint }, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(adServerFixture.data);

  });

});
