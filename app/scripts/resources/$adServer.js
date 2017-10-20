angular.module('ts-id-lookup')
.service('$adServer', function(
  qParamEncodeSubStringQuery,
  $resource,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/ad_servers',
    {
      order_by: 'descending',
      page_limit: '50',
      page_offset: '0'
    },
    {
      query: {
        method:'GET', isArray:false,
        params: {
          q: qParamEncodeSubStringQuery
        }
      }
    }
  );
});
