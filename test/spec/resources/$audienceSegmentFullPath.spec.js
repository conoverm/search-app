describe('$audienceSegmentFullPath resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $audienceSegmentFullPath, audienceSegmentFullPath;

  beforeEach(inject(function($injector) {
    $audienceSegmentFullPath = $injector.get('$audienceSegmentFullPath');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    audienceSegmentFullPath = __mocks__['mocks/audienceSegmentFullPathQVegas'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$audienceSegmentFullPath resource should exist', function () {
    expect(typeof $audienceSegmentFullPath).toBe('function');
  });

  it('should respond with audience segment full path data', function (){

    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/path_audience_segments?full=audience_segment' +
    '&order_by=descending&page_limit=50' +
    '&page_offset=0' +
    '&sort_by=-created_on')
    .respond(audienceSegmentFullPath);

    $audienceSegmentFullPath.get().$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(audienceSegmentFullPath.data);

  });

  it('$audienceSegmentFullPath.query() request should respond with specific data', function (){

    var query = { substringQuery: 'stuff & things' };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
      '/path_audience_segments?full=audience_segment' +
      '&order_by=descending&page_limit=50&page_offset=0' +
      '&q=name%3D:*stuff%2520%2526%2520things*' +
      '&sort_by=-created_on')
      .respond(audienceSegmentFullPath);

    $audienceSegmentFullPath.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(audienceSegmentFullPath.data);

  });

  it('$audienceSegmentFullPath.query() should not send a query with a space: ""', function (){

    var query = { substringQuery: ' ' };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
      '/path_audience_segments?full=audience_segment' +
      '&order_by=descending&page_limit=50&page_offset=0' +
      '&q=name%3D:**' +
      '&sort_by=-created_on')
      .respond(audienceSegmentFullPath);

    $audienceSegmentFullPath.query(null, {}).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(audienceSegmentFullPath.data);

  });

  it('$audienceSegmentFullPath.query() should handle parentProviderId', function (){

    var query = { parentProviderId: 'ONEBAZILLION' };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
      '/path_audience_segments' + '?' +
      'full=audience_segment' +
      '&order_by=descending' + '&' +
      'page_limit=50' + '&' +
      'page_offset=0' + '&' +
      'q=name%3D:**%26audience_vendor_id%3D%3DONEBAZILLION' +
      '&sort_by=-created_on'
      )
      .respond(audienceSegmentFullPath);

    $audienceSegmentFullPath.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(audienceSegmentFullPath.data);

  });
});
