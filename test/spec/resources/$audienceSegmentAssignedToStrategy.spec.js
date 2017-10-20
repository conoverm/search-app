describe('$audienceSegmentAssignedToStrategy resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $audienceSegmentAssignedToStrategy, audienceSegmentAssignedToStrategyFixture, fullQueryParam;

  beforeEach(inject(function($injector) {
    $audienceSegmentAssignedToStrategy = $injector.get('$audienceSegmentAssignedToStrategy');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
    fullQueryParam = $injector.get('fullQueryParam');
  }));

  beforeEach(function(){
    audienceSegmentAssignedToStrategyFixture = __mocks__['mocks/audienceSegmentAssignedToStrategy1896596'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$audienceSegmentAssignedToStrategy resource should exist', function () {
    expect(typeof $audienceSegmentAssignedToStrategy).toBe('function');
  });

  it('should respond with audienceSegmentAssignedToStrategy.json data', function (){

    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/strategies/1896596/audience_segments?full=*&order_by=descending&page_limit=50&page_offset=0&sort_by=-created_on')
    .respond(audienceSegmentAssignedToStrategyFixture);

    $audienceSegmentAssignedToStrategy.get({ strategyid: '1896596' }).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(audienceSegmentAssignedToStrategyFixture.data);

  });

});
