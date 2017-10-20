describe('$audienceSegmentTaxonomy resource', function () {

  'use strict';

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  var $resource, T1URL, T1ApiBase, $httpBackend;
  var $audienceSegmentTaxonomy, audienceSegmentTaxonomy;

  beforeEach(inject(function($injector) {
    $audienceSegmentTaxonomy = $injector.get('$audienceSegmentTaxonomy');
    $resource = $injector.get('$resource');
    T1URL = $injector.get('T1URL');
    T1ApiBase = $injector.get('T1ApiBase');
    $httpBackend = $injector.get('$httpBackend');
  }));

  beforeEach(function(){
    audienceSegmentTaxonomy = __mocks__['mocks/audienceSegmentTaxonomy1737369'];
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('$audienceSegmentTaxonomy resource should exist', function () {
    expect(typeof $audienceSegmentTaxonomy).toBe('function');
  });

  it('should respond with audience segment taxonomy data', function (){

    var resolvedValue;

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/audience_segments' +
    '?full=*' +
    '&order_by=descending&page_limit=50' +
    '&page_offset=0' +
    '&sort_by=-created_on')
    .respond(audienceSegmentTaxonomy);

    $audienceSegmentTaxonomy.get().$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();
    expect(resolvedValue).toEqual(audienceSegmentTaxonomy.data);

  });

  it('$audienceSegmentsTaxonomy.query() filters on the parent param', function (){

    var resolvedValue;
    var query = {
      substringQuery: '3412'
    };

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/audience_segments' + '?' +
    'full=*' +
    '&order_by=descending' +
    '&page_limit=50' +
    '&page_offset=0' +
    '&parent=3412' +
    '&sort_by=-created_on')
    .respond(audienceSegmentTaxonomy);

    $audienceSegmentTaxonomy.query({}, query).$promise
    .then(function(response) {
      resolvedValue = response.data;
    });

    $httpBackend.flush();

    expect(resolvedValue).toEqual(audienceSegmentTaxonomy.data);

  });

});
