angular.module('ts-id-lookup')
.service('$targetDimensions', function(
  qParamEncodeSubStringQuery,
  $resource,
  $log,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/target_values?dimension=:targetDimension',
    {
      order_by: 'descending',
      page_limit: '50',
      page_offset: '0',
      sort_by: 'name',
      full: '*'
    },
    {
      query: {
        method:'GET', isArray:false,
        params: {
          q: qParamEncodeSubStringQuery,
          parent: function(data){
            return data.parent;
          }
        },
      }
    });
});
