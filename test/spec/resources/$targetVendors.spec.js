describe('$targetVendors resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $targetVendors, targetVendorsNoQuery, targetVendorsFactual;

  beforeEach(inject(function($injector) {
    $targetVendors = $injector.get('$targetVendors');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    targetVendorsNoQuery = __mocks__['mocks/targetVendorsNoQuery'];
    targetVendorsFactual = __mocks__['mocks/targetVendorsFactual'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$targetVendors resource should exist', function () {
    expect(typeof $targetVendors).toBe('function');
  });

  it('$targetVendors.query() works with substringQuery specified', function (){

    var resolvedValue;
    var query = {
      substringQuery: 'Factual'
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/targeting_vendors' + '?' +
    'full=targeting_vendor' +
    '&order_by=descending' +
    '&page_limit=100' +
    '&page_offset=0' +
    '&q=%3CFactual%3E' +
    '&sort_by=-created_on')
    .respond(targetVendorsFactual);

    $targetVendors.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(targetVendorsFactual.data);

  });

  it('$targetVendors.query() works without a specific query', function (){

    var resolvedValue;
    var query = {
      substringQuery: ''
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/targeting_vendors' + '?' +
    'full=targeting_vendor' +
    '&order_by=descending' +
    '&page_limit=100' +
    '&page_offset=0' +
    '&sort_by=-created_on')
    .respond(targetVendorsNoQuery);

    $targetVendors.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(targetVendorsNoQuery.data);

  });

});
