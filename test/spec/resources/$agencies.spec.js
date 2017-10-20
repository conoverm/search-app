describe('$agencies resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $agencies, agenciesFixture, fullQueryParam;

  beforeEach(inject(function($injector) {
    $agencies = $injector.get('$agencies');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
    fullQueryParam = $injector.get('fullQueryParam');
  }));

  beforeEach(function(){
    agenciesFixture = __mocks__['mocks/agencies'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$agencies resource should exist', function () {
    expect(typeof $agencies).toBe('function');
  });

  it('should respond with agencies.json data', function (){

    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/agencies' + '?' +
    'order_by=descending' + '&' +
    'page_limit=50' + '&' +
    'page_offset=0' + '&' +
    'sort_by=-created_on')
    .respond(agenciesFixture);

    $agencies.get().$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(agenciesFixture.data);

  });

  it('$agencies.query() request should have default params', function (){

    var query = { substringQuery: 'stuff & things' };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
      '/agencies' + '?' +
      'order_by=descending&page_limit=50&page_offset=0' +
      '&q=%3Cstuff%2520%2526%2520things%3E&sort_by=-created_on')
      .respond(agenciesFixture);

    $agencies.query({ entityEndpoint: query.entityEndpoint }, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(agenciesFixture.data);

  });

});
