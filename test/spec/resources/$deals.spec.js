describe('$deals resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, MediaBase, $httpBackend;
  var $deals, dealsFixture, fullQueryParam;

  beforeEach(inject(function($injector) {
    $deals = $injector.get('$deals');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    MediaBase = $injector.get('MediaBase');
    $httpBackend = $injector.get('$httpBackend');
    fullQueryParam = $injector.get('fullQueryParam');
  }));

  beforeEach(function(){
    dealsFixture = __mocks__['mocks/deals'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$deals resource should exist', function () {
    expect(typeof $deals).toBe('function');
  });

  it('should respond with deals.json data', function (){

    var resolvedValue;

    $httpBackend.expectGET(T1URL + MediaBase +
    '/deals?order_by=descending&page_limit=50&page_offset=0')
    .respond(dealsFixture);

    $deals.get().$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(dealsFixture.data);

  });

  it('$deals.query() request should have default params', function (){

    var query = { substringQuery: 'stuff & things' };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + MediaBase +
      '/deals?order_by=descending&page_limit=50&page_offset=0' +
      '&q=name%3D:*stuff+%26+things*')
      .respond(dealsFixture);

    $deals.query({}, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(dealsFixture.data);

  });

  it('$deals.query() should default to no search without a specific user query', function (){

    var query = { substringQuery: false };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + MediaBase +
      '/deals' + '?' +
      'order_by=descending' + '&' +
      'page_limit=50' + '&' +
      'page_offset=0')
      .respond(dealsFixture);

    $deals.query({}, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(dealsFixture.data);

  });

  it('$deals.query() should have defaults', function (){

    var query = { attributeToQueryOn: 'EMPTY'};
    var resolvedValue;

    $httpBackend.expectGET(T1URL + MediaBase +
      '/deals' + '?' +
      'order_by=descending' + '&' +
      'page_limit=50' + '&' +
      'page_offset=0')
      .respond(dealsFixture);

    $deals.query({}, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(dealsFixture.data);

  });

  it('$deals.query() should handle strategy_id param', function (){

    var query = { strategyId: 'oneMillion' };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + MediaBase +
      '/deals' + '?' +
      'order_by=descending' + '&' +
      'page_limit=50' + '&' +
      'page_offset=0' + '&' +
      'strategy_id=oneMillion')
      .respond(dealsFixture);

    $deals.query({}, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(dealsFixture.data);

    query = {};

    $httpBackend.expectGET(T1URL + MediaBase +
      '/deals' + '?' +
      'order_by=descending' + '&' +
      'page_limit=50' + '&' +
      'page_offset=0')
      .respond(dealsFixture);

    $deals.query({}, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(dealsFixture.data);

  });

  it('$deals.singleDeal() requests a single deal ID', function (){

    var query = { substringQuery: 90909 };
    var resolvedValue;

    $httpBackend.expectGET(T1URL + MediaBase +
      '/deals' +
      '/' + query.substringQuery +
      '?' +
      'order_by=descending' + '&' +
      'page_limit=50' + '&' +
      'page_offset=0')
      .respond(dealsFixture);

    $deals.singleDeal({id: query.substringQuery }).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(dealsFixture.data);

  });

  it('$deals.query() owner param modifies Request for Owners', function (){

    var query = {
      owner: {
        entityId: 180089,
        entityFilter: 'Organization'
      }
    };

    var resolvedValue;

    $httpBackend.expectGET(T1URL + MediaBase +
      '/deals' + '?' +
      'owner.organization_id=' + query.owner.entityId + '&' +
      'order_by=descending' + '&' +
      'page_limit=50' + '&' +
      'page_offset=0')
      .respond(dealsFixture);

    $deals.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    query = {
      owner: {
        entityId: 987,
        entityFilter: 'Advertiser'
      }
    };

    $httpBackend.expectGET(T1URL + MediaBase +
      '/deals' + '?' +
      'owner.advertiser_id=' + query.owner.entityId + '&' +
      'order_by=descending' + '&' +
      'page_limit=50' + '&' +
      'page_offset=0')
      .respond(dealsFixture);

    $deals.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    query = {
      owner: {
        entityId: 981117,
        entityFilter: 'Agency'
      }
    };

    $httpBackend.expectGET(T1URL + MediaBase +
      '/deals' + '?' +
      'owner.agency_id=' + query.owner.entityId + '&' +
      'order_by=descending' + '&' +
      'page_limit=50' + '&' +
      'page_offset=0')
      .respond(dealsFixture);


    $deals.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(dealsFixture.data);

  });

  it('$deals.query() permissions param modifies request by permissions', function (){

    var query = {
      permissions: {
        entityId: 180089,
        entityFilter: 'Advertiser'
      }
    };

    var resolvedValue;

    $httpBackend.expectGET(T1URL + MediaBase +
      '/deals' + '?' +
      'permissions.advertiser_id=' + query.permissions.entityId + '&' +
      'order_by=descending' + '&' +
      'page_limit=50' + '&' +
      'page_offset=0')
      .respond(dealsFixture);

    $deals.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(dealsFixture.data);

  });

});
