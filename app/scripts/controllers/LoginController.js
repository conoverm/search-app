angular.module('ts-id-lookup')
.controller('LoginController', function(
  $scope,
  $location,
  $login) {

  'use strict';

  $scope.login = function(user, pass) {

    var loginData = {
      'user': user,
      'password': pass,
    };

    $login.login(loginData).$promise
    .then(function(response) {

      if (response.meta.status !== 'ok') {
        throw new Error('/login did not respond \'ok\'');
      }

      $location.path('/');

    }, function() {

      $scope.loginFail = true;

    });

  };

});
