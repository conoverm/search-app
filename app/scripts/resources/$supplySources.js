angular.module('ts-id-lookup')
.service('$supply_sources', function(
  encodeSubstringQueryTerm,
  $resource,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/supply_sources',
    {
      order_by: 'descending',
      page_limit: '50',
      page_offset: '0',
      sort_by: '-created_on',
      full: '*'
    },
    {
      query: {
        method:'GET', isArray:false,
        params: {
          q: function(data){
            return encodeSubstringQueryTerm(data.substringQuery)
          }
        }
      }
    });
});
