describe('$generic resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $generic;

  beforeEach(inject(function($injector) {
    $generic = $injector.get('$generic');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$generic resource should exist', function () {
    expect(typeof $generic).toBe('function');
  });

  it('$generic.get() needs an endpoint', function (){

    var fixture = {data: { genericEntity: 'genericData'} };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/pants?order_by=descending&page_limit=50&page_offset=0&sort_by=-created_on')
    .respond(fixture);


    $generic.get({'entityEndpoint': 'pants'}).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(fixture.data);

  });

  it('$generic.query() works with substringQuery specified', function (){

    var fixture = {data: { genericEntity: 'genericData'} };
    var resolvedValue;
    var query = {
      substringQuery: 'stuff & things',
      entityEndpoint: 'pants'
    };

    $httpBackend.expectGET(T1URL + T1ApiBase + '/pants?' +
    'order_by=descending' + '&' +
    'page_limit=50' + '&' +
    'page_offset=0' + '&' +
    'q=%3Cstuff%2520%2526%2520things%3E' + '&' +
    'sort_by=-created_on')
    .respond(fixture);

    $generic.query({ entityEndpoint: query.entityEndpoint }, {substringQuery: query.substringQuery}).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(fixture.data);

  });

  it('$generic.query() works with an object that has a substringQuery value', function (){

    var fixture = {data: { genericEntity: 'genericData'} };
    var resolvedValue;
    var query = {
      substringQuery: 'stuff & things',
      entityEndpoint: 'pants'
    };

    $httpBackend.expectGET(T1URL + T1ApiBase + '/pants?' +
    'order_by=descending' + '&' +
    'page_limit=50' + '&' +
    'page_offset=0' + '&' +
    'q=%3Cstuff%2520%2526%2520things%3E' + '&' +
    'sort_by=-created_on')
    .respond(fixture);

    $generic.query({ entityEndpoint: query.entityEndpoint }, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(fixture.data);

  });

});
