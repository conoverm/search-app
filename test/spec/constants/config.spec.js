describe('Test config module', function() {
  'use strict';

  // load the service's module
  beforeEach(module('config'));

  // instantiate service
  var T1URL, T1ApiBase;
  beforeEach(inject(function(_T1URL_, _T1ApiBase_) {
    T1URL = _T1URL_;
    T1ApiBase = _T1ApiBase_;
  }));


  it('should return API endpoint constants', function() {
    expect(T1URL).toBe('//localhost:8081');
    expect(T1ApiBase).toBe('/api/v2.0');
  });

});
