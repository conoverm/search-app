function EntityController(
UserService,
spinnerService,
entityModels,
$q) {

  'use strict';

  var vm = this;
  var user = UserService;
  vm.entityList = entityModels;
  vm.entity = entityModels.organizations;
  vm.queryResults = [];
  vm.nextPageResult = '';
  vm.clear = false
  vm.count = 0;
  vm.clearCount = 0;
  vm.request = undefined;
  vm.requestError = false;

  user.checkSession()
  .then(function(ret) {
    /* jshint ignore:start */
    ga('IDLookup.set', 'userId', ret);

    ga('IDLookup.send', {
      'hitType': 'event',
      'eventCategory': 'IDLookup Auth Check',
      'eventAction': 'check session'
    });
    /* jshint ignore:end */

    user.createUserObj(ret);
  })
  .catch(function() {
    angular.noop();
  });

  function fetchParentProviders() {

    if (vm.entity.queryFilter.parentProviderList.length > 1) {
      return;
    }

    vm.entityList[vm.entity.queryFilter.provider].resource.get().$promise
    .then(function(res) {
      angular.forEach(res.data, function(value) {
        this.push(value);
      }, vm.entity.queryFilter.parentProviderList);

      vm.parentProvider = vm.entity.queryFilter.parentProviderList[0];

    })
    .catch(function() {
      angular.noop();
    });

  }

  function extraQueryTemplate() {
    var entity = vm.entity;
    var ret = '';

    if (entity.extraQueryTemplate) {
      ret = 'scripts/extra-query/' + entity.extraQueryTemplate + '.html';
    }

    if (vm.entity.queryFilter && vm.entity.queryFilter.provider) {
      fetchParentProviders();
    }

    return ret;
  }

  vm.extraQueryTemplate = extraQueryTemplate();

  vm.changeEntity = function() {
    if (vm.entity.queryFilter && vm.entity.queryFilter.provider) {
      vm.parentProvider = vm.entity.queryFilter.parentProviderList[0];
    }
    vm.extraQueryTemplate = extraQueryTemplate();
    vm.clearCount++;
    vm.search = '';
    vm.queryResults = [];
    vm.clear = 'clear' + String(vm.clearCount)
    vm.count = 0;

    /* jshint ignore:start */
    ga('IDLookup.send', 'event', 'Entity', 'Change Entity', vm.entity.displayName)
    /* jshint ignore:end */
  }

  function parseEntities(response) {
    var entities = []

    if (response === undefined || response.data === undefined) {
        return entities;
    }

    return angular.isArray(response.data) ? response.data : [response.data];
  }

  function cancelPending(request) {
    if (request && request.$cancelRequest) {
        request.$cancelRequest()
    }
  }

  function spin(spin) {
    var ret = spin ?
    spinnerService.showGroup('loaders') :
    spinnerService.hideGroup('loaders');
    return ret;
  }

  function queryEntity(resource, query) {
    vm.requestError = false;
    spin(true);
    cancelPending(vm.request);

    switch (vm.entity.displayName) {
      case 'Creative Check':
        vm.request = resource.creativeCheck({ id: query.substringQuery });

        break;
      case 'PMP-E Deals':

        if (vm.entity.queryFilter.AttributeToQueryOn === 'deal_id') {
          vm.request = resource.singleDeal({ id: query.substringQuery })
          break;
        }

        if (!!vm.entity.queryFilter.AttributeToQueryOn) {
          query.attributeToQueryOn = vm.entity.queryFilter.AttributeToQueryOn;
        }

        if (vm.entity.queryFilter.AttributeToQueryOn === 'strategy_id') {
          query.strategyId = query.substringQuery;
        }

        if (!!vm.entity.queryFilter.owner.entityFilter &&
            !!vm.entity.queryFilter.owner.entityId) {
          query.owner = {
            entityFilter: vm.entity.queryFilter.owner.entityFilter,
            entityId: vm.entity.queryFilter.owner.entityId
          }
        }

        if (!!vm.entity.queryFilter.permissions.entityFilter &&
            !!vm.entity.queryFilter.permissions.entityId) {
          query.permissions = {
            entityFilter: vm.entity.queryFilter.permissions.entityFilter,
            entityId: vm.entity.queryFilter.permissions.entityId
          }
        }
        vm.request = resource.query(
          null,
          query
        );
        break;
      case 'Target Dimensions':
        if (!!vm.entity.queryFilter.targetDimensionParent) {
          query.parent = vm.entity.queryFilter.targetDimensionParent;
        }

        vm.request = resource.query({ targetDimension: vm.entity.queryFilter.targetDimension },
          query
        );
        break;
      case 'Targeting Segment Objectives':
        vm.request = resource.get();
        break;
      case 'Audience Segment Ids':
        vm.request = resource.get({ id: query.substringQuery });
        break;
      case 'Targeting Segment Ids':
        vm.request = resource.get({ id: query.substringQuery });
        break;
      case 'Assigned Audience Segments':
        vm.request = resource.get({ strategyid: query.substringQuery });
        break;
      case 'Targeting Segment Assigned to Strategy':
        vm.request = resource.get({ strategyid: query.substringQuery });
        break;
      case 'Audience Segment Full Path':
        var queryObj = {};

        if (!!vm.parentProvider && !!vm.parentProvider.audience_vendor_id) {
          queryObj.parentProviderId = vm.parentProvider.audience_vendor_id;
        }

        queryObj.substringQuery = query.substringQuery || undefined;
        queryObj.parentEntityType = query.parentEntityType || undefined;

        vm.request = resource.query({}, queryObj);

        break;
      case 'Targeting Segment Full Path':
        queryObj = {};

        if (!!vm.parentProvider && !!vm.parentProvider.id) {
          queryObj.parentProviderId = vm.parentProvider.id;
        }

        queryObj.substringQuery = query.substringQuery || undefined;
        queryObj.parentEntityType = query.parentEntityType || undefined;

        vm.request = resource.query({}, queryObj);

        break;
      default:
        queryObj = {};

        queryObj.substringQuery = query.substringQuery || undefined;
        queryObj.parentEntityType = query.parentEntityType || undefined;

        vm.request = resource.query({ entityEndpoint: query.entityEndpoint },
            queryObj
        )
    }

    /* jshint ignore:start */
    ga('IDLookup.send', 'event', 'Query', 'Resource Queried', vm.entity.displayName);
    /* jshint ignore:end */

    return vm.request.$promise
    .then(function(response) {
      vm.queryResults = parseEntities(response);
      vm.nextPageResult = response.meta.next_page;
      vm.count = response.meta.total_count;

      /* jshint ignore:start */
      ga('IDLookup.send', 'event', 'Query', 'Query Success')
      /* jshint ignore:end */

      return response;
    },
    function(err) {
      if (!query.substringQuery && !err.data) {
          return err;
      }

      // A 'cancelled' promise return an 'error' without a response
      if (err.data && err.data.errors) {
          vm.requestError = err.data.errors[0];
      }

      /* jshint ignore:start */
      ga('IDLookup.send', 'event', 'Query', 'Query Error', err)
      /* jshint ignore:end */

      return err;
    })

  }

  vm.parseSearch = function(queryTerm) {
    var query = {};
    var resource;

    if (vm.searchInput.$invalid) {
      return;
    }

    if (vm.entity && vm.entity.endPoint) {
      /**
      This conditional is transitional. When/If all the entities have their
      own endpoints the model will not specifically have an endPoint to pass
      into the $generic resource. If the $generic resource continues to be used
      this conditional needs to stay so the $resource knows which endpoint
      to request data from. MC 1/11/17
      **/
      query.entityEndpoint = vm.entity.endPoint;
    }


    if (vm.entity.resource === undefined) {
      return;
      // need some error in the UI.
      // "entity model does not have a resource"
      // or something
    } else {
      resource = vm.entity.resource;
    }

    if (vm.entity.parentEntityType) {
      query.parentEntityType = vm.entity.parentEntityType;
    }

    if (vm.entity.childEntityType) {
      query.childEntityType = vm.entity.childEntityType;
    }

    query.substringQuery = queryTerm;
    $q.when(queryEntity(resource, query))
    .then(function(res) {
      if (res.status === -1) {
        spin(true)
      } else {
        spin(false)
      }
    },
    function() {
      spin(false)
    });

  };

}

angular.module('ts-id-lookup')
.component('entitySearch', {

  bindings: {
    sentId: '='
  },

  templateUrl: 'scripts/components/entitySearch.html',

  controller: EntityController

});
