describe('$organizations resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $organizations, organizationsFixture, fullQueryParam;

  beforeEach(inject(function($injector) {
    $organizations = $injector.get('$organizations');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
    fullQueryParam = $injector.get('fullQueryParam');
  }));

  beforeEach(function(){
    organizationsFixture = __mocks__['mocks/organizations'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$organizations resource should exist', function () {
    expect(typeof $organizations).toBe('function');
  });

  it('should respond with organizations.json data', function (){

    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/organizations')
    .respond(organizationsFixture);

    $organizations.get().$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(organizationsFixture.data);

  });

  it('$organizations.query() request should have default params', function (){

    var query = { substringQuery: 'stuff & things' };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
      '/organizations' + '?' +
      'full=organization' +
      '&order_by=descending&page_limit=50&page_offset=0' +
      '&q=%3Cstuff%2520%2526%2520things%3E&sort_by=-created_on')
      .respond(organizationsFixture);

    $organizations.query({ entityEndpoint: query.entityEndpoint }, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(organizationsFixture.data);

  });

});
