describe('$strategies resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $strategies, strategiesFullParentQVegas;

  beforeEach(inject(function($injector) {
    $strategies = $injector.get('$strategies');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    strategiesFullParentQVegas = __mocks__['mocks/strategies.full.parent.QVegas'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$strategies resource should exist', function () {
    expect(typeof $strategies).toBe('function');
  });

  it('$strategies.query() works with substringQuery specified', function (){

    var resolvedValue;
    var query = {
      substringQuery: 'Chicory'
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/strategies' + '?' +
    'full=strategy' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&q=%3CChicory%3E' +
    '&sort_by=-created_on')
    .respond(strategiesFullParentQVegas);

    $strategies.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(strategiesFullParentQVegas.data);

  });

  it('$strategies.query() works without a specific query', function (){

    var resolvedValue;
    var query = {
      substringQuery: ''
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/strategies' + '?' +
    'full=strategy' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&sort_by=-created_on')
    .respond(strategiesFullParentQVegas);

    $strategies.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(strategiesFullParentQVegas.data);

  });

});
