angular.module('ts-id-lookup')
.factory('$login', function(
  $resource,
  $httpParamSerializerJQLike,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/login',
    {},
    {
      login: {
        method: 'POST',
        cache: false,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(data) {
          return $httpParamSerializerJQLike(data);
        }
      }
    });
});
