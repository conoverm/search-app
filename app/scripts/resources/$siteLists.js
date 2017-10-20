angular.module('ts-id-lookup')
.service('$siteLists', function(
  qParamEncodeSubStringQuery,
  $resource,
  T1URL,
  T1ApiBase,
  fullQueryParam) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/site_lists',
    fullQueryParam,
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
