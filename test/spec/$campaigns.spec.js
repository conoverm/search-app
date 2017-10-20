describe('$campaigns resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $campaigns, campaignsNoQuery, campaignsQchicory;

  beforeEach(inject(function($injector) {
    $campaigns = $injector.get('$campaigns');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    campaignsNoQuery = __mocks__['mocks/campaignsNoQuery'];
    campaignsQchicory = __mocks__['mocks/campaignsQchicory'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$campaigns resource should exist', function () {
    expect(typeof $campaigns).toBe('function');
  });

  it('$campaigns.query() works with substringQuery specified', function (){

    var resolvedValue;
    var query = {
      substringQuery: 'Chicory'
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/campaigns' + '?' +
    'full=campaign' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&q=%3CChicory%3E' +
    '&sort_by=-created_on')
    .respond(campaignsQchicory);

    $campaigns.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(campaignsQchicory.data);

  });

    it('$campaigns.query() works without a specific query', function (){

    var resolvedValue;
    var query = {
      substringQuery: ''
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/campaigns' + '?' +
    'full=campaign' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&sort_by=-created_on')
    .respond(campaignsQchicory);

    $campaigns.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(campaignsQchicory.data);

  });

});
