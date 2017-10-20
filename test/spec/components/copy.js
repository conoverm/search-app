describe('Component: copy', function() {
  'use strict';

  var $componentController, selectedEntity, resultsCtrl;
  var FileSaver, Blob, ga;

  beforeEach(module('ts-id-lookup'));
  beforeEach(inject(function(_$componentController_, _FileSaver_, _Blob_) {

    $componentController = _$componentController_;
    FileSaver = _FileSaver_;
    Blob = _Blob_;
    window.ga = {};

    selectedEntity = {
      displayName: 'Organizations',
      resource: function(){ return 'i\'m a resource'; },
      resultsTable: 'organizations'
    };

    resultsCtrl = $componentController('results', null,
                    { selectedEntity: selectedEntity }
                  );

    spyOn(window, 'ga').and.callFake(function(){
      return true;
    });

  }));



  it('should expose a `sentId` binding', function() {
    var bindings = {sentId: 12345, selectedEntity: selectedEntity};
    var ctrl = $componentController('copy', null, bindings);

    expect(ctrl.sentId).toBeDefined();
    expect(ctrl.sentId).toBe(12345);
  });

  it('should have copyArray be empty', function(){
    var ctrl = $componentController('copy', null);
    expect(ctrl.copyArray).toEqual([]);
  });

  it('should have cleared copyArray on function call', function(){
    var bindings = { parentCtrl: { styleIcon: resultsCtrl.styleIcon, storeId: resultsCtrl.storeId }};

    var ctrl = $componentController('copy', null, bindings);

    spyOn(ctrl, 'clearArray').and.callThrough();

    ctrl.copyArray = [123];
    ctrl.clearArray();

    expect(ctrl.clearArray).toHaveBeenCalled();
    expect(ctrl.copyObjArray).toEqual([]);
    expect(ctrl.copyArray).toEqual([]);
  });

  it('should copy and return the correct string',function(){
    var ctrl = $componentController('copy', null);
    ctrl.copyObjArray = [{text:'12345'},{text:'12344'}];

    spyOn(ctrl, 'copyToString').and.callThrough();

    ctrl.copyToString();
    var returnCopy = ctrl.copyToString();


    expect(ctrl.copyToString).toHaveBeenCalled();
    expect(returnCopy).toEqual('12345;12344');
  });

  it('should detect binding change and add an element to the array', function(){
    var ctrl = $componentController('copy', null);
    var changes = {sentId:{currentValue:'12345'}};

    spyOn(ctrl, '$onChanges').and.callThrough();

    ctrl.$onChanges(changes);

    expect(ctrl.$onChanges).toHaveBeenCalled();
  });

  it('should do nothing if sentId is undefined or changes has no "sentId" key', function(){
    var ctrl = $componentController('copy', null);
    var changes = {sentId:{currentValue:undefined}};

    spyOn(ctrl, '$onChanges').and.callThrough();

    var rVal = ctrl.$onChanges(changes);
    expect(ctrl.$onChanges).toHaveBeenCalled();
    expect(rVal).toEqual('currentValue not set');

    changes = {};
    rVal = ctrl.$onChanges(changes);

    expect(rVal).toBe(undefined);

  });

  it('should do nothing if sentId is false', function(){
    var ctrl = $componentController('copy', null);
    var changes = {sentId:{currentValue:false}};

    spyOn(ctrl, '$onChanges').and.callThrough();

    ctrl.$onChanges(changes);

    var rVal = ctrl.$onChanges(changes);
    expect(ctrl.$onChanges).toHaveBeenCalled();
    expect(rVal).toEqual('currentValue not set');
  });

  it('should call clear array if sentId is clear', function(){
    var bindings = { parentCtrl: { styleIcon: resultsCtrl.styleIcon, storeId: resultsCtrl.storeId }};

    var ctrl = $componentController('copy', null, bindings);
    var changes = {sentId:{currentValue:'clear'}};

    spyOn(ctrl, '$onChanges').and.callThrough();
    spyOn(ctrl, 'clearArray');

    ctrl.$onChanges(changes);
    expect(ctrl.clearArray).toHaveBeenCalled();
    expect(ctrl.copyObjArray).toEqual([]);
    expect(ctrl.copyArray).toEqual([]);
  });

  it('should return false if length is greater than 0', function(){
    var ctrl = $componentController('copy', null);

    spyOn(ctrl, 'checkArray').and.callThrough();

    ctrl.copyArray = [123,23,12];

    var resp = ctrl.checkArray();

    expect(ctrl.checkArray).toHaveBeenCalled();
    expect(resp).toBeFalsy();
  });


  it('should return true if length is 0', function(){
    var ctrl = $componentController('copy', null);

    spyOn(ctrl, 'checkArray').and.callThrough();

    ctrl.copyArray = [];

    var resp = ctrl.checkArray();

    expect(ctrl.checkArray).toHaveBeenCalled();
    expect(resp).toBeTruthy();
  });

  it('should update parent', function(){
    var bindings = { parentCtrl: { styleIcon: resultsCtrl.styleIcon, storeId: resultsCtrl.storeId }};

    var ctrl = $componentController('copy', null, bindings);
    var tag = {text: 123};

    spyOn(ctrl, 'updateParent').and.callThrough();
    spyOn(resultsCtrl, 'styleIcon').and.callThrough();
    spyOn(resultsCtrl, 'storeId').and.callThrough();

    ctrl.updateParent(tag);
    resultsCtrl.styleIcon(tag.text,'black');
    resultsCtrl.storeId(false);

    expect(ctrl.updateParent).toHaveBeenCalledWith(tag);
    expect(resultsCtrl.styleIcon).toHaveBeenCalledWith(tag.text, 'black');
    expect(resultsCtrl.storeId).toHaveBeenCalledWith(false);
  });

  it('export should be disabled if no results', function(){
    var bindings = { parentCtrl: { data: [] } };
    var ctrl = $componentController('copy', null, bindings);
    var disabled = ctrl.exportEnable();

    expect(disabled).toBe(true);

    bindings = { parentCtrl: { data: [{ name: 'I am a thing', id: 1234 }] } };
    ctrl = $componentController('copy', null, bindings);

    disabled = ctrl.exportEnable();

    expect(disabled).toBe(false);

  });

  it('should export an XLSX', function(){
    var bindings = { parentCtrl:
      {
        data: [],
        selectedEntity: {
            organizations: {
              displayName: 'Organizations'
            }
          }
        }
      };

    var ctrl = $componentController('copy', null, bindings);
    spyOn(FileSaver, 'saveAs').and.callFake(function(){
      return true;
    });
    ctrl.exportResults();
    expect(FileSaver.saveAs).toHaveBeenCalled();

  });

});
