angular.module('ts-id-lookup')
.service('$targetVendors', function(
  qParamEncodeSubStringQuery,
  $resource,
  $log,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/targeting_vendors',
    {
      order_by: 'descending',
      page_limit: '100',
      page_offset: '0',
      sort_by: '-created_on',
      full: 'targeting_vendor'
    },
    {
      query: {
        method:'GET', isArray:false,
        params: {
          q: qParamEncodeSubStringQuery
        }
      }
    });
});
