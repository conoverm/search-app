describe('$targetSegments resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $targetSegments, targetSegmentsNoQuery, targetSegments4569;

  beforeEach(inject(function($injector) {
    $targetSegments = $injector.get('$targetSegments');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    targetSegmentsNoQuery = __mocks__['mocks/targetSegmentsNoQuery'];
    targetSegments4569 = __mocks__['mocks/targetSegments4569'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$targetSegments resource should exist', function () {
    expect(typeof $targetSegments).toBe('function');
  });

  it('$targetSegments.get() works with substringQuery specified', function (){

    var resolvedValue;
    var query = {
      id: '4569'
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/targeting_segments' +
    '/' + query.id +
    '?' +
    'full=*' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&sort_by=-created_on')
    .respond(targetSegments4569);

    $targetSegments.get(query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(targetSegments4569.data);

  });

  it('$targetSegments.get() works without a specific query', function (){

    var resolvedValue;
    var query = {
      id: ''
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/targeting_segments' + '?' +
    'full=*' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&sort_by=-created_on')
    .respond(targetSegmentsNoQuery);

    $targetSegments.get(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(targetSegmentsNoQuery.data);

  });

});
