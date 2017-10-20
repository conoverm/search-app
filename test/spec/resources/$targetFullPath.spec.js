describe('$targetFullPath resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $targetFullPath, targetFullPath;

  beforeEach(inject(function($injector) {
    $targetFullPath = $injector.get('$targetFullPath');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    targetFullPath = __mocks__['mocks/targetFullPath'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$targetFullPath resource should exist', function () {
    expect(typeof $targetFullPath).toBe('function');
  });

  it('should respond with target segment full path data', function (){

    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/path_targeting_segments' + '?' +
    'full=path_targeting_segment' +
    '&order_by=descending&page_limit=50' +
    '&page_offset=0' +
    '&sort_by=-created_on')
    .respond(targetFullPath);

    $targetFullPath.get().$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(targetFullPath.data);

  });

  it('$targetFullPath.query() request should have respond with specific data', function (){

    var query = { substringQuery: 'sports' };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
      '/path_targeting_segments' + '?' +
      'full=path_targeting_segment' +
      '&order_by=descending&page_limit=50&page_offset=0' +
      '&q=name%3D:*sports*' +
      '&sort_by=-created_on')
      .respond(targetFullPath);

    $targetFullPath.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(targetFullPath.data);

  });

  it('$targetingSegmentFullPath.query() should not send a query with a space: ""', function (){

    var query = { substringQuery: ' ' };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
      '/path_targeting_segments' + '?' +
      'full=path_targeting_segment' +
      '&order_by=descending&page_limit=50&page_offset=0' +
      '&q=name%3D:**' +
      '&sort_by=-created_on')
      .respond(targetFullPath);

    $targetFullPath.query(null, {}).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(targetFullPath.data);

  });

});
