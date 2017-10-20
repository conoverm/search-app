angular.module('ts-id-lookup')
.service('$atomicCreatives', function(
  qParamEncodeSubStringQuery,
  $resource,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/atomic_creatives',
  {
    order_by: 'descending',
    page_limit: '100',
    page_offset: '0',
    full: 'atomic_creative'
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
    },
    creativeCheck: {
      method:'GET', isArray:false,
      url: T1URL + T1ApiBase + '/atomic_creatives/:id',
      params: {
        full: 'atomic_creative',
        with: 'concept'
      }
    }
  })
});
