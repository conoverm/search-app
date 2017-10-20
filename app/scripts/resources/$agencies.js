angular.module('ts-id-lookup')
.service('$agencies', function(
  $resource,
  T1URL,
  T1ApiBase,
  qParamEncodeSubStringQuery) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/agencies',
    {
      order_by: 'descending',
      page_limit: '50',
      page_offset: '0',
      sort_by: '-created_on'
    },
    {
      query: {method:'GET', isArray:false,
      params: {
        q: qParamEncodeSubStringQuery,
        with: function(data){
          return data.parentEntityType
        }
      }
    }
    });
});
