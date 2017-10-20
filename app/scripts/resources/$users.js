angular.module('ts-id-lookup')
.service('$users', function(
  $resource,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/users/:userID');

});
