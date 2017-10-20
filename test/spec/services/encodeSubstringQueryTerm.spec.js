describe('Service: encodeSubstringQueryTerm', function () {
  'use strict';

  // load the service's module
  beforeEach(module('ts-id-lookup'));

  // instantiate service
  var encodeSubstringQueryTerm;
  beforeEach(inject(function ($injector) {
    encodeSubstringQueryTerm = $injector.get('encodeSubstringQueryTerm');
  }));

  it('should have request function', function () {
    expect(typeof encodeSubstringQueryTerm).toBe('function');
  });

  it('should ignore requests with no params on the substring object', function () {
    var config = {
      params:  {
        substringQuery: ''
      }
    };
    var result = encodeSubstringQueryTerm(config.params.substringQuery);

    expect(result).toEqual('');
  });

  it('should modify substringQuery param', function () {
    var config = {
     params: {
      substringQuery: 'P&G' }
    };

    var configAfterEncoding = {
      params: {
        q: '<P%26G>' }
    };

    var result = encodeSubstringQueryTerm(config.params.substringQuery);

    expect(result).toEqual(configAfterEncoding.params.q);
    expect(result.substringQueryTerm).toBe(undefined);
  });


});
