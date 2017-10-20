describe('$targetSegmentAssignedToStrategy resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $targetSegmentAssignedToStrategy, targetSegmentAssignedToStrategyFixture, fullQueryParam;

  beforeEach(inject(function($injector) {
    $targetSegmentAssignedToStrategy = $injector.get('$targetSegmentAssignedToStrategy');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
    fullQueryParam = $injector.get('fullQueryParam');
  }));

  beforeEach(function(){
    targetSegmentAssignedToStrategyFixture = __mocks__['mocks/targetSegmentAssignedToStrategy2223832'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$targetSegmentAssignedToStrategy resource should exist', function () {
    expect(typeof $targetSegmentAssignedToStrategy).toBe('function');
  });

  it('should respond with targetSegmentAssignedToStrategy.json data', function (){

    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/strategies/2223832/targeting_segments?full=*&order_by=descending&page_limit=50&page_offset=0&sort_by=-created_on')
    .respond(targetSegmentAssignedToStrategyFixture);

    $targetSegmentAssignedToStrategy.get({ strategyid: '2223832' }).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(targetSegmentAssignedToStrategyFixture.data);

  });

});
