angular.module('ts-id-lookup')
.service('UserService', function(
  $session,
  $users,
  $location,
  $q) {

  'use strict';

  var userObj = {};

  this.getUser = function() {
    return userObj;
  };

  // @TODO: use etag in response and cache this. Then, set this call for an OPTIONS for the etag.
  // will best be done using interceptors and a cache service.
  this.createUserObj = function(userId) {
    userId = userId || userObj.userId;

    return $users.get({'userID': userId}).$promise
    .then(function(response) {
      if (response.meta.status !== 'ok') {
        return $q.reject('status not ok');
      }

      userObj = response.data;

      return userObj;

    }, function(err) {
      return $q.reject(err);
    });

  };

  this.checkSession = function() {

    return $session.get().$promise
    .then(function(response) {

      userObj.sessionId = response.data.session.sessionid;
      userObj.userId = response.data.id;
      return userObj.userId;

    }, function(reject) {
      $location.path('/login');
      return $q.reject(reject);
    });
  };

  return this;

});
