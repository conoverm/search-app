describe('$advertisers resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $advertisers, organizationsFixture, fullQueryParam;

  beforeEach(inject(function($injector) {
    $advertisers = $injector.get('$advertisers');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    // don't actually care about data, so just using whatever
    organizationsFixture = __mocks__['mocks/organizations'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$advertisers resource should exist', function () {
    expect(typeof $advertisers).toBe('function');
  });

  it('$advertisers.query() request should have default params', function (){

    var query = { substringQuery: 'stuff & things' };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
      '/advertisers' + '?' +
      'order_by=descending' +
      '&page_limit=50&page_offset=0' +
      '&q=%3Cstuff%2520%2526%2520things%3E' +
      '&sort_by=-created_on')
      .respond(organizationsFixture);

    $advertisers.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(organizationsFixture.data);

  });

});
