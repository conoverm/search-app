angular.module('ts-id-lookup')
.factory('authInterceptorFactory', function ($q, $location) {
  'use strict';

  return {
    response: function(response) {
      if (response.meta && response.meta.status && response.meta.status === 'auth_required') {
        $location.path('/login');
      }

      return response || $q.when(response);
    },
    responseError: function(rejection) {

      if (rejection.status === 401) {
        $location.path('/login');
      }

      return $q.reject(rejection);
    }

  };
});
