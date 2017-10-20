function encodeDealQueryTerm() {
  'use strict';

  var encoder = function(param, attribute) {
    var searchEncodings = {
      supply_source_id: (attribute + '==' + param),
      name:             (attribute + '=:*' + param + '*'),
      deal_identifier:  (attribute + '=:*' + param + '*')
    }

    return searchEncodings[attribute];
  }

  return encoder;
}

angular.module('ts-id-lookup').service('encodeDealQueryTerm', encodeDealQueryTerm)
