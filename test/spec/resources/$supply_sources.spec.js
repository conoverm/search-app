describe('$supply_sources resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $supply_sources, supply_sources;

  beforeEach(inject(function($injector) {
    $supply_sources = $injector.get('$supply_sources');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    supply_sources = __mocks__['mocks/supplySources'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$supply_sources resource should exist', function () {
    expect(typeof $supply_sources).toBe('function');
  });

  it('$supply_sources.query() works with substringQuery specified', function (){

    var resolvedValue;
    var query = {
      substringQuery: 'Chicory'
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/supply_sources' + '?' +
    'full=*' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&q=%3CChicory%3E' +
    '&sort_by=-created_on')
    .respond(supply_sources);

    $supply_sources.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(supply_sources.data);

  });

  it('$supply_sources.query() works without a specific query', function (){

    var resolvedValue;
    var query = {
      substringQuery: ''
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/supply_sources' + '?' +
    'full=*' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&q=' +
    '&sort_by=-created_on')
    .respond(supply_sources);

    $supply_sources.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(supply_sources.data);

  });

});
