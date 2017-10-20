angular.module('ts-id-lookup')
.service('$campaigns', function(
  qParamEncodeSubStringQuery,
  $resource,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/campaigns',
    {},
    {
      query: {
        method:'GET', isArray:false,
        params: {
          order_by: 'descending',
          page_limit: '50',
          page_offset: '0',
          sort_by: '-created_on',
          full: 'campaign',
          q: qParamEncodeSubStringQuery,
          with: function(data){
            return data.parentEntityType;
          }
        }
      },
      child: {
        params: {
          order_by: 'descending',
          page_limit: '100',
          page_offset: '0',
          sort_by: '-created_on'
        },
        url: T1URL + T1ApiBase + '/strategies/limit/campaign=:id',
        method: 'GET',
        isArray: false
      }
    });
});
