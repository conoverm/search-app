angular.module('resourcesConfig', [])

.constant('genericQueryParams',
  {
    order_by: 'descending',
    page_limit: '50',
    page_offset: '0',
    sort_by: '-created_on'
  }
)

.constant('fullQueryParam',
  {
    order_by: 'descending',
    page_limit: '50',
    page_offset: '0',
    sort_by: '-created_on',
    full: '*'
  }
)

.factory('qParamEncodeSubStringQuery', function(encodeSubstringQueryTerm){
    'use strict';
    return function(data){
      if (!data.substringQuery) {
        return;
      }

      return encodeSubstringQueryTerm(data.substringQuery)
    }
  }
)
;
