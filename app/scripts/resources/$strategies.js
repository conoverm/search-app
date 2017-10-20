angular.module('ts-id-lookup')
.service('$strategies', function(
  qParamEncodeSubStringQuery,
  $resource,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/strategies',
    {},
    {
      query: {
        method:'GET', isArray:false,
        params: {
          order_by: 'descending',
          page_limit: '50',
          page_offset: '0',
          sort_by: '-created_on',
          full: 'strategy',
          q: qParamEncodeSubStringQuery,
          with: function(data){
            return data.parentEntityType
          }
        }
      }
    });
});
