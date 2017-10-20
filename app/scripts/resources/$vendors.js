angular.module('ts-id-lookup')
.service('$vendors', function(
  qParamEncodeSubStringQuery,
  $resource,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/vendors',
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
          q: qParamEncodeSubStringQuery,

          with: function(data){
            return data.parentEntityType
          }
        }
      }
    });
});
