angular.module('ts-id-lookup')
.service('$advertisers', function(
  qParamEncodeSubStringQuery,
  $resource,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/advertisers',
    {},
    {
      query: {
        method:'GET', isArray:false,
        params: {
          order_by: 'descending',
          page_limit: '50',
          page_offset: '0',
          sort_by: '-created_on',
          q: qParamEncodeSubStringQuery,
          with: function(data){
            return data.parentEntityType
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
        url: T1URL + T1ApiBase + '/campaigns/limit/advertiser=:id',
        method: 'GET',
        isArray: false
      }
    });
});
