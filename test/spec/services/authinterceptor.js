describe('Service: authinterceptor', function () {
  'use strict';

  // load the service's module
  beforeEach(module('ts-id-lookup'));

  // instantiate service
  var authinterceptor;
  beforeEach(inject(function (_authInterceptorFactory_) {
    authinterceptor = _authInterceptorFactory_;
  }));

  it('should have response and responseError', function () {
    expect(authinterceptor.response).toBeDefined();
    expect(authinterceptor.responseError).toBeDefined();
  });

});
