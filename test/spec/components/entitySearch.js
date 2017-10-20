describe('Component: EntitySearch', function() {
  'use strict';

  var $componentController, $httpBackend;
  var bindings, ctrl, strategiesFixture;
  var spinnerService;

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject(function(_$componentController_,
    _$httpBackend_,
    _spinnerService_
    ) {
    $componentController = _$componentController_;
    $httpBackend = _$httpBackend_;
    spinnerService = _spinnerService_;
  }));

  beforeEach(function(){
    strategiesFixture = __mocks__['mocks/strategies.p&g'];
  });

  afterEach(function() {
    bindings = {};
    ctrl = {};
  });

  it('on app init, check session', function(){
    bindings = {};
    ctrl = $componentController('entitySearch', null, bindings);
    // $httpBackend.flush();

    expect(typeof ctrl).toEqual('object');
  });

});
