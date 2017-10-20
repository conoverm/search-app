angular.module('ts-id-lookup')
.service('$targetSegmentAssignedToStrategy', function(
  $resource,
  T1URL,
  T1ApiBase,
  fullQueryParam) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/strategies/:strategyid/targeting_segments',
    fullQueryParam
  );
});
