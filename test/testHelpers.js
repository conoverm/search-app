function testHelpers($urlRouterProvider) {
    'use strict';

    var helpers = {};

    helpers.deferRouteFetch = function($urlRouterProvider) {
        $urlRouterProvider.deferIntercept();
    }

    return helpers;

}

angular.module('ts-id-lookup').service('testHelpers', testHelpers)
