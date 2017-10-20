describe('$videoCreatives resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));

  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $videoCreatives, videosFixtureNoQuery, videosFixtureVegas;

  beforeEach(inject(function($injector) {
    $videoCreatives = $injector.get('$videoCreatives');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));



  beforeEach(function(){
    videosFixtureNoQuery = __mocks__['mocks/videoCreatives.noquery'];
    videosFixtureVegas = __mocks__['mocks/videoCreatives.<vegas>'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$videoCreatives resource should exist', function () {
    expect(typeof $videoCreatives).toBe('function');
  });

  it('should respond with video atomic creative entities', function (){

    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/atomic_creatives?' +
    'order_by=descending' + '&' +
    'page_limit=100' + '&' +
    'full=atomic_creative' + '&' +
    'page_offset=0' + '&' +
    'q=media_type%3D%3Dvideo'
    )
    .respond(videosFixtureNoQuery);

    $videoCreatives.get().$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(videosFixtureNoQuery.data);

  });

  it('$videoCreatives.query() request should handle substring query itself,' +
    'not pass it to the application substring request interceptor', function (){

    var query = { substringQuery: 'vegas' };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/atomic_creatives?' +
    'order_by=descending' + '&' +
    'page_offset=0' + '&' +
    'page_limit=100' + '&' +
    'full=atomic_creative' + '&' +
    'q=media_type%3D%3Dvideo%26%3Cvegas%3E')
    .respond(videosFixtureVegas);

    $videoCreatives.query(query, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(videosFixtureVegas.data);

  });

});
