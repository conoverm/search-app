describe('$targetDimensions resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $targetDimensions, targetDimensionsFixture, targetDimensionsFixtureError;

  beforeEach(inject(function($injector) {
    $targetDimensions = $injector.get('$targetDimensions');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    targetDimensionsFixture = __mocks__['mocks/targetDimensionsREGNQAla'];
    targetDimensionsFixtureError = __mocks__['mocks/targetDimensionsError'];

  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$targetDimensions resource should exist', function () {
    expect(typeof $targetDimensions).toBe('function');
  });

  it('fetch without a dimension should be an error', function (){

    var errorResponse;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/target_values' + '?' +
    'dimension=' + '&' +
    'full=*' + '&' +
    'order_by=descending' + '&' +
    'page_limit=50' + '&' +
    'page_offset=0' + '&' +
    'sort_by=name'
    )
    .respond(400, targetDimensionsFixtureError);

    $targetDimensions.get().$promise
    .then(null, function(error) {
      errorResponse = error.data.errors;
    });

    $httpBackend.flush();
    expect(errorResponse).toEqual(targetDimensionsFixtureError.errors);

  });

  it('$targetDimension.query() requires a \'dimension\'', function (){

    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
      '/target_values' + '?' +
      'dimension=REGN' + '&' +
      'full=*' + '&' +
      'order_by=descending' + '&' +
      'page_limit=50' + '&' +
      'page_offset=0' + '&' +
      'sort_by=name')
      .respond(targetDimensionsFixture);

    $targetDimensions.query({ targetDimension: 'REGN' }, {}).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(targetDimensionsFixture.data);

  });

  it('$targetDimension.query() can query further on a \'dimension\'', function (){

    var query = { substringQuery: 'Ala'};
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
      '/target_values' + '?' +
      'dimension=REGN' + '&' +
      'full=*' + '&' +
      'order_by=descending' + '&' +
      'page_limit=50' + '&' +
      'page_offset=0' + '&' +

      'q=%3CAla%3E' + '&' +

      'sort_by=name')
      .respond(targetDimensionsFixture);

    $targetDimensions.query({ targetDimension: 'REGN' }, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(targetDimensionsFixture.data);

  });

});
