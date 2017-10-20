function encodeSubstringQueryTerm() {
  'use strict';

  var encoder = function(substringQuery) {
    return (substringQuery) ?
      '<' + encodeURIComponent(substringQuery) + '>' :
      '';
  }

  return encoder;

}

angular.module('ts-id-lookup').service('encodeSubstringQueryTerm', encodeSubstringQueryTerm)
