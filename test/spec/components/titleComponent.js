describe('Component: titleComponent', function() {
  'use strict';
  var $componentController;

  beforeEach(module('ts-id-lookup'));
  beforeEach(inject(function(_$componentController_) {
    $componentController = _$componentController_;
  }));

  it('should expect title to be Entity Lookup', function(){
    var ctrl = $componentController('titleComponent', null);

    expect(ctrl.title).toBe('Entity Lookup');
  });


});
