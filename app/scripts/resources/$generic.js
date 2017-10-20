angular.module('ts-id-lookup')
.service('$generic', function(
  qParamEncodeSubStringQuery,
  $resource,
  T1URL,
  T1ApiBase,
  genericQueryParams
  ) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/:entityEndpoint',
    genericQueryParams,
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
