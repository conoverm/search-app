describe('$targetObjectives resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $targetObjectives, targetObjectivesFixture, genericQueryParams;

  beforeEach(inject(function($injector) {
    $targetObjectives = $injector.get('$targetObjectives');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
    genericQueryParams = $injector.get('genericQueryParams');
  }));

  beforeEach(function(){
    targetObjectivesFixture = __mocks__['mocks/targetObjectivesFixture'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$targetObjectives resource should exist', function () {
    expect(typeof $targetObjectives).toBe('function');
  });

  it('should respond with targetObjectives.json data', function (){

    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/targeting_segment_objectives?order_by=descending&page_limit=50&page_offset=0&sort_by=-created_on')
    .respond(targetObjectivesFixture);

    $targetObjectives.get().$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(targetObjectivesFixture.data);

  });

});
