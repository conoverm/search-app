angular.module('ts-id-lookup')
.service('$targetSegmentChildren', function(
  $resource,
  $log,
  T1URL,
  T1ApiBase,
  fullQueryParam) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/targeting_segments',
    fullQueryParam,
    {
      query: {
        method:'GET', isArray:false,
        params: {
          parent: function(data){
            return data.substringQuery
          }
        }
      }
    });
});
