angular.module('ts-id-lookup')
.service('$audienceSegmentAssignedToStrategy', function(
  $resource,
  T1URL,
  T1ApiBase,
  fullQueryParam) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/strategies/:strategyid/audience_segments',
    fullQueryParam
  );
});
