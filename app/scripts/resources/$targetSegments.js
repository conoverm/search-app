angular.module('ts-id-lookup')
.service('$targetSegments', function(
  qParamEncodeSubStringQuery,
  $resource,
  T1URL,
  T1ApiBase,
  fullQueryParam) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/targeting_segments/:id',
    fullQueryParam
  );
});
