describe('Component: results', function() {
  'use strict';

  var $componentController, $httpBackend, $location, $q;
  var bindings, ctrl, strategiesFixture, selectedEntity;
  var spinnerService, ENV, T1URL;

  beforeEach(module('ts-id-lookup'));
  beforeEach(module(function($urlRouterProvider) {
    // ignore url/state change for this test
    $urlRouterProvider.deferIntercept();
  }));

  beforeEach(inject(function(_$componentController_,
    _$httpBackend_,
    _spinnerService_,
    _ENV_,
    _T1URL_,
    _$location_,
    _$q_) {
    $componentController = _$componentController_;
    $httpBackend = _$httpBackend_;
    spinnerService = _spinnerService_;
    ENV  = _ENV_;
    T1URL = _T1URL_;
    $location = _$location_;
    $q = _$q_;
    selectedEntity = {
      displayName: 'Organizations',
      resource: function(){ return 'i\'m a resource'; },
      resultsTable: 'organizations'
    };

    ctrl = $componentController('results', null,
            { selectedEntity: selectedEntity }
           );

    window.ga = {};
    spyOn(window, 'ga').and.callFake(function(){
      return true;
    });

  }));

  beforeEach(function(){
    strategiesFixture = __mocks__['mocks/strategies.p&g'];
  });

  afterEach(function() {
    bindings = {};
    ctrl = {};

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('expects binding to be bound', function(){
    bindings = {
      data: [],
      resultsCount: 0,
      nextPage: '',
      selectedEntity: selectedEntity
    };
    ctrl = $componentController('results', null, bindings);

    expect(ctrl.selectedEntity).toEqual(selectedEntity);
    expect(ctrl.data).toEqual([]);
    expect(ctrl.resultsCount).toBe(0);
    expect(ctrl.nextPage).toBe('');
  });

  it('should call storeId with correct args', function() {
    spyOn(ctrl, 'storeId');

    ctrl.storeId(1234);

    expect(ctrl.storeId).toHaveBeenCalled();
    expect(ctrl.storeId.calls.argsFor(0)).toEqual([1234]);

  });

  it('should store the id correctly', function() {
    spyOn(ctrl, 'storeId').and.callThrough();

    ctrl.storeId(1234);

    expect(ctrl.id).toEqual(1234);
  });

  it('$onChanges should do nothing without a changes object', function() {
    spyOn(ctrl, '$onChanges').and.callThrough();

    ctrl.$onChanges();

    expect(ctrl.$onChanges).toHaveBeenCalled();
  });

  it('getNextResultSet() should fetch results and concat on ctrl.data', function(){
    var resolvedValue;

    spyOn(spinnerService, 'showGroup').and.callFake(function(){
      return true;
    });

    spyOn(spinnerService, 'hideGroup').and.callFake(function(){
      return true;
    });

    bindings = {
      data: strategiesFixture.data,
      resultsCount: strategiesFixture.meta.total_count,
      nextPage: strategiesFixture.meta.next_page,
      selectedEntity: selectedEntity
    };

    ctrl = $componentController('results', {}, bindings);

    ctrl.nextPage = strategiesFixture.meta.next_page;

    expect(ctrl.data.length).toBe(30);

    $httpBackend.expectGET(ctrl.nextPage.replace('https://api.mediamath.com', $location.protocol() + ':' + T1URL))
    .respond(strategiesFixture);
    ctrl.getNextResultSet();
    $httpBackend.flush();

    expect(ctrl.data.length).toBe(60);

    $httpBackend.expectGET(ctrl.nextPage.replace('https://api.mediamath.com', $location.protocol() + ':' + T1URL))
    .respond(strategiesFixture);
    ctrl.getNextResultSet();
    $httpBackend.flush();

    expect(ctrl.data.length).toBe(90);
  });

  it('onchanges should assign clear to id when clearCopy is true', function(){
    var changes = {clearCopy:{currentValue:true}};

    spyOn(ctrl, '$onChanges').and.callThrough();

    ctrl.$onChanges(changes);
    expect(ctrl.$onChanges).toHaveBeenCalled();
    expect(ctrl.id).toBe('clear');
  });

  it('$onChanges should do nothing if clear is not true', function(){
    var changes = { clearCopy:undefined };

    bindings = {
      id: '1234'
    };

    ctrl = $componentController('results', null, bindings);

    expect(ctrl.id).toBe('1234');

    ctrl.$onChanges(changes);

    expect(ctrl.id).toBe('1234');

  });

  it('results table should change on entity change', function(){
    bindings = {
      resultsTable: selectedEntity.resultsTable,
      selectedEntity: selectedEntity
    };

    var agency = {
      displayName: 'Agencies',
      resource: function(){ return 'i\'m an agency resource'; },
      resultsTable: 'agencies'
    };

    var changes = { selectedEntity: { currentValue: agency } };

    ctrl = $componentController('results', null, bindings);

    expect(ctrl.resultsTable).toBe('organizations');

    ctrl.$onChanges(changes);

    expect(ctrl.resultsTable).toBe('scripts/results-tables/' + agency.resultsTable + '.html');

  });

  it('resultsTable() should do nothing if not passed a selectedEntity', function(){
    bindings = {
      resultsTable: selectedEntity.resultsTable,
      selectedEntity: selectedEntity
    };

    var changes = { selectedEntity: {} };

    ctrl = $componentController('results', null, bindings);

    expect(ctrl.resultsTable).toBe('organizations');

    ctrl.$onChanges(changes);

    expect(ctrl.resultsTable).toBe('organizations');

  });

});
