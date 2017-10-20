angular.module('ts-id-lookup')
.service('$targetObjectives', function(
  $resource,
  $log,
  T1URL,
  T1ApiBase,
  qParamEncodeSubStringQuery,
  genericQueryParams) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/targeting_segment_objectives',
    genericQueryParams
  );
});
