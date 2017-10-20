describe('$pixels resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $pixels, pixelsNoQuery, pixelsQbepretty;

  beforeEach(inject(function($injector) {
    $pixels = $injector.get('$pixels');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    pixelsNoQuery = __mocks__['mocks/pixelsNoQuery'];
    pixelsQbepretty = __mocks__['mocks/pixelsQbepretty'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$pixels resource should exist', function () {
    expect(typeof $pixels).toBe('function');
  });

  it('$pixels.query() works with substringQuery specified', function (){

    var resolvedValue;
    var query = {
      substringQuery: 'Chicory'
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/pixel_bundles' + '?' +
    'full=pixel_bundle' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&q=%3CChicory%3E' +
    '&sort_by=-created_on')
    .respond(pixelsQbepretty);

    $pixels.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(pixelsQbepretty.data);

  });

  it('$pixels.query() works without a specific query', function (){

    var resolvedValue;
    var query = {
      substringQuery: ''
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/pixel_bundles' + '?' +
    'full=pixel_bundle' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&sort_by=-created_on')
    .respond(pixelsNoQuery);

    $pixels.query(null, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(pixelsNoQuery.data);

  });

});
