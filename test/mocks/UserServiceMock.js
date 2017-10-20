angular.module('UserServiceMock', [])
  .factory('UserService', function($q) {
  'use strict';

  var deferred = $q.defer();
  var userObj = {};

  this.getUser = function() {
    return userObj;
  };

  this.createUserObj = function(userId) {
    deferred.resolve({ userId: 'pants'});
  };

  this.checkSession = function() {
    var sessionData = { "data" : {
        "session" : {
          "current_time" : "2017-04-05T17:57:51",
          "sessionid" : "ARGLBARGL",
          "expires" : "2017-04-06T17:57:51"
        },
        "entity_type" : "user",
        "name" : "mconover",
        "id" : 8415
        },
        "meta" : {
          "status" : "ok"
        }
      };

    deferred.resolve(sessionData);
  }

  return this;
  });
