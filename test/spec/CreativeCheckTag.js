 describe('Component: CreativeCheckTag', function() {
  'use strict';

  var $componentController, $httpBackend, $rootScope, $compile, $document;
  var creativeCheckCtrl, creative;
  var creativeID4550231, limitConcept;
  var ga;
  var T1URL, T1ApiBase;

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));
  beforeEach(inject(function(_$componentController_,
    _$httpBackend_,
    _ENV_,
    _T1URL_,
    _T1ApiBase_,
    _$rootScope_,
    _$compile_,
    _$document_
  ) {
    $httpBackend = _$httpBackend_;
    T1ApiBase  = _T1ApiBase_;
    T1URL = _T1URL_;
    $componentController = _$componentController_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $document = _$document_;

    window.ga = {};
    spyOn(window, 'ga').and.callFake(function(){
      return true;
    });

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  beforeEach(function(){
    creativeID4550231 = __mocks__['mocks/creativeID4550231'];
    limitConcept = __mocks__['mocks/strategiesLimitConcept725374'];

  });

  it('controller should exist and have a creative bound to it', function(){
    var bindings = {};
    var ctrl = $componentController('creativeCheckTag', null, bindings);

    expect(ctrl.creative).toBeUndefined();

    bindings = { creative: creativeID4550231 };
    ctrl = $componentController('creativeCheckTag', null, bindings);

    expect(ctrl.creative).toBe(creativeID4550231);

  });

  it('$onChanges with no changes object makes no requests and does not update creative iframe', function(){

    var $ctrl = $componentController('creativeCheckTag');
    var scope = $rootScope.$new();

    scope.data = '';

    var element = angular.element('<creative-check-tag creative="data"></creative-check-tag>');
    element = $compile(element)(scope);

    $ctrl.$onChanges();

    expect($ctrl.iframe.src).toEqual('');
    expect($ctrl.iframe.style).toEqual('width:100%;height:300px');

  });

  it('$onChanges changes object with creative.currentValue.height changes the iframe model\'s style attribute', function(){

    var $ctrl = $componentController('creativeCheckTag');
    var changes = {
      creative: {
        currentValue: { height: 250 }
      }
    };

    $ctrl.$onChanges(changes);

    expect($ctrl.iframe.style).toEqual('width:100%;height:295px');

  });

  it('$onChanges makes requests with a creative in the changes.currentValue object', function(){

    var $ctrl = $componentController('creativeCheckTag');
    var changes = {
      creative: {
        currentValue: creativeID4550231
      }
    };

    $httpBackend.expectPOST('/creativeCheck')
    .respond({
      creativeCheckUrl: '/creativeCheck/45678'
    });

    $httpBackend.expectGET(T1URL + T1ApiBase +
    '/strategies/limit/strategy_concepts.concept=' + changes.creative.currentValue.concept_id +
    '?with=campaign,advertiser,agency,organization&full=strategy,campaign')
    .respond(limitConcept);

    $ctrl.$onChanges(changes);

    $httpBackend.flush();

    expect($ctrl.conceptStrategyLink).toEqual(limitConcept.data);



  });

});
