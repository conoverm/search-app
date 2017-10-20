describe('$displayCreatives resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $displayCreatives, displayFixtureNoQuery, displayFixtureBean;

  beforeEach(inject(function($injector) {
    $displayCreatives = $injector.get('$displayCreatives');
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

  it('$displayCreatives resource should exist', function () {
    expect(typeof $displayCreatives).toBe('function');
  });

  it('should respond with video atomic creative entities', function (){

    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/atomic_creatives?' +
    'order_by=descending' + '&' +
    'page_limit=100' + '&' +
    'full=atomic_creative' + '&' +
    'page_offset=0' + '&' +
    'q=media_type%3D%3Ddisplay'
    )
    .respond(displayFixtureNoQuery);

    $displayCreatives.get().$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(displayFixtureNoQuery.data);

  });

  it('$displayCreatives.query() request should handle substring query itself,' +
    'not pass it to the application substring request interceptor', function (){

    var query = { substringQuery: 'bean' };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/atomic_creatives?' +
    'order_by=descending' + '&' +
    'page_limit=100' + '&' +
    'full=atomic_creative' + '&' +
    'page_offset=0' + '&' +
    'q=media_type%3D%3Ddisplay%26%3Cbean%3E')
    .respond(displayFixtureBean);

    $displayCreatives.query(query, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(displayFixtureBean.data);

  });

});
