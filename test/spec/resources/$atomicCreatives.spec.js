describe('$atomicCreatives resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $atomicCreatives, displayFixtureNoQuery, displayFixtureBean;

  beforeEach(inject(function($injector) {
    $atomicCreatives = $injector.get('$atomicCreatives');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    displayFixtureNoQuery = __mocks__['mocks/displayCreatives.noquery'];
    displayFixtureBean = __mocks__['mocks/displayCreatives.<bean>'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$atomicCreatives resource should exist', function () {
    expect(typeof $atomicCreatives).toBe('function');
  });

  it('should respond with atomic creative entities', function (){

    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/atomic_creatives?' +
    'order_by=descending' + '&' +
    'page_limit=100' + '&' +
    'full=atomic_creative' + '&' +
    'page_offset=0'
    )
    .respond(displayFixtureNoQuery);

    $atomicCreatives.get().$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(displayFixtureNoQuery.data);

  });

  it('$atomicCreatives.query() request should handle substring query itself,' +
    'not pass it to the application substring request interceptor', function (){

    var query = { substringQuery: 'bean' };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/atomic_creatives?' +
    'order_by=descending' + '&' +
    'page_limit=100' + '&' +
    'full=atomic_creative' + '&' +
    'page_offset=0' + '&' +
    'q=%3Cbean%3E')
    .respond(displayFixtureBean);

    $atomicCreatives.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(displayFixtureBean.data);

  });

  it('$atomicCreatives.creativeCheck() should request a specific atomicCreative,' +
    'with specific parameters', function (){

    var query = { id: '47589' };
    var resolvedValue;
    var fakeResponse;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/atomic_creatives' +
    '/47589' +
    '?' +
    'order_by=descending' + '&' +
    'page_limit=100' + '&' +
    'full=atomic_creative' + '&' +
    'page_offset=0' + '&' +
    'with=concept')
    .respond(fakeResponse);

    $atomicCreatives.creativeCheck(query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(fakeResponse).toEqual(fakeResponse);

  });

});
