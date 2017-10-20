describe('$targetSegmentChildren resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $targetSegmentChildren, targetSegmentChildrenNoQuery, targetSegmentChildren4569;

  beforeEach(inject(function($injector) {
    $targetSegmentChildren = $injector.get('$targetSegmentChildren');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    targetSegmentChildrenNoQuery = __mocks__['mocks/targetSegmentChildrenNoQuery'];
    targetSegmentChildren4569 = __mocks__['mocks/targetSegmentChildren4569'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$targetSegmentChildren resource should exist', function () {
    expect(typeof $targetSegmentChildren).toBe('function');
  });

  it('$targetSegmentChildren.query() works with substringQuery specified', function (){

    var resolvedValue;
    var query = {
      substringQuery: '4569'
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/targeting_segments' + '?' +
    'full=*' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&parent=4569' +
    '&sort_by=-created_on')
    .respond(targetSegmentChildren4569);

    $targetSegmentChildren.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(targetSegmentChildren4569.data);

  });

  it('$targetSegmentChildren.query() works without a specific query', function (){

    var resolvedValue;
    var query = {
      substringQuery: ''
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/targeting_segments' + '?' +
    'full=*' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&parent=' +
    '&sort_by=-created_on')
    .respond(targetSegmentChildrenNoQuery);

    $targetSegmentChildren.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(targetSegmentChildrenNoQuery.data);

  });

});
