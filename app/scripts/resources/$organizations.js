angular.module('ts-id-lookup')
.service('$organizations', function(
  qParamEncodeSubStringQuery,
  $resource,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/organizations',
    {},
    {
      query: {
        method:'GET', isArray:false,
        params: {
          order_by: 'descending',
          page_limit: '50',
          page_offset: '0',
          sort_by: '-created_on',
          full: 'organization',
          q: qParamEncodeSubStringQuery
        }
      },
      child: {
        params: {
          order_by: 'descending',
          page_limit: '100',
          page_offset: '0',
          sort_by: '-created_on'
        },
        url: T1URL + T1ApiBase + '/organizations/:id/seats',
        method: 'GET',
        isArray: false
      }
    });
});
