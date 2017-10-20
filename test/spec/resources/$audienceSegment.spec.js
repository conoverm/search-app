describe('$audienceSegments resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $audienceSegments, audienceSegmentNoQuery, audienceSegmentQChicory;

  beforeEach(inject(function($injector) {
    $audienceSegments = $injector.get('$audienceSegments');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    audienceSegmentNoQuery = __mocks__['mocks/audienceSegmentProviderNoQuery'];
    audienceSegmentQChicory = __mocks__['mocks/audienceSegmentProviderQChicory'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$audienceSegments resource should exist', function () {
    expect(typeof $audienceSegments).toBe('function');
  });

  it('$audienceSegments.get() works with substringQuery specified', function (){

    var resolvedValue;
    var query = {
      id: '17453'
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/audience_segments' +
    '/' + query.id +
    '?' +
    'full=audience_segment' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&sort_by=name')
    .respond(audienceSegmentQChicory);

    $audienceSegments.get({ id: query.id }).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(audienceSegmentQChicory.data);

  });

  it('$audienceSegments.get() works without a specific query', function (){

    var resolvedValue;
    var query = {
      id: ''
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/audience_segments' + '?' +
    'full=audience_segment' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&sort_by=name')
    .respond(audienceSegmentQChicory);

    $audienceSegments.get().$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(audienceSegmentQChicory.data);

  });

  it('$audienceSegments.query() works with substringQuery specified', function (){

    var resolvedValue;
    var query = {
      substringQuery: 'chic'
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/audience_segments' +
    '?' +
    'full=audience_segment' +
    '&q=%3Cchic%3E' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&sort_by=name')
    .respond(audienceSegmentQChicory);

    $audienceSegments.query({}, { substringQuery: query.substringQuery }).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(audienceSegmentQChicory.data);

  });

  it('$audienceSegments.query() works with substringQuery unspecified', function (){

    var resolvedValue;
    var query = {
      substringQuery: ''
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/audience_segments' +
    '?' +
    'full=audience_segment' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&sort_by=name')
    .respond(audienceSegmentQChicory);

    $audienceSegments.query({}, { substringQuery: query.substringQuery }).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(audienceSegmentQChicory.data);

  });

});
