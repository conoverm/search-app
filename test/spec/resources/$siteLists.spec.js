describe('$siteLists resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $siteLists, site_lists;

  beforeEach(inject(function($injector) {
    $siteLists = $injector.get('$siteLists');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    site_lists = __mocks__['mocks/siteLists'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$siteLists resource should exist', function () {
    expect(typeof $siteLists).toBe('function');
  });

  it('$siteLists.query() works with substringQuery specified', function (){

    var resolvedValue;
    var query = {
      substringQuery: 'Chicory'
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/site_lists' + '?' +
    'full=*' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&q=%3CChicory%3E' +
    '&sort_by=-created_on')
    .respond(site_lists);

    $siteLists.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(site_lists.data);

  });

  it('$siteLists.query() works without a specific query', function (){

    var resolvedValue;
    var query = {
      substringQuery: ''
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/site_lists' + '?' +
    'full=*' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&sort_by=-created_on')
    .respond(site_lists);

    $siteLists.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(site_lists.data);

  });

});
