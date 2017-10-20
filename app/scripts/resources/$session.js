angular.module('ts-id-lookup')
.service('$session', function(
  $resource,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/session');
});
