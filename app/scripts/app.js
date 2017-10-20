angular
  .module('ts-id-lookup', [
    'templates-app',
    'ngRoute',
    'ui.router',
    'ngclipboard',
    'ngResource',
    'config',
    'resourcesConfig',
    'angularSpinners',
    'ngTagsInput',
    'tagged.directives.infiniteScroll',
    'zumba.angular-waypoints',
    'ngFileSaver'
  ])
  .config(function(
    $urlRouterProvider,
    $stateProvider,
    $httpProvider,
    tagsInputConfigProvider,
    $resourceProvider
  ) {
  'use strict';

  $urlRouterProvider
    .when('/', '/index')
    .otherwise('/index');

  $stateProvider
    .state('main', {
      url: '/index',
      templateUrl: 'views/main.html'
    })
    .state({
      name: 'login',
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginController'
    })

  tagsInputConfigProvider
    .setDefaults('tagsInput', {
      placeholder: '',
      addOnEnter: false
    })

  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $httpProvider.defaults.headers.common['Accept'] = 'application/vnd.mediamath.v1+json';
  $httpProvider.interceptors.push('authInterceptorFactory');
  $resourceProvider.defaults.cancellable = true;

});
