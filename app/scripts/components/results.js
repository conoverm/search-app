function ResultsController(T1URL, ENV, $http, spinnerService, $location) {

  'use strict';

  var vm = this;
  vm.resultsTable = '';
  vm.infiniteFetching = false;
  vm.childInfo = {};

  vm.fetchChild = function(entityId) {

    /* jshint ignore:start */
    ga('IDLookup.send', 'event', 'Entity', 'Child Entity Fetch', vm.selectedEntity.displayName)
    /* jshint ignore:end */

    if (vm.childInfo[entityId]) { return }

    vm.selectedEntity.resource.child({id: entityId},
    function(res){
      vm.childInfo[entityId] = {
        data: res.data,
        meta: res.meta
      };
    })
  }

  vm.storeId = function(id) {
    vm.id = id;
  };

  function parseNextPage() {
    return vm.nextPage.replace('https://api.mediamath.com', $location.protocol() + ':' + T1URL);
  }

  function clearNextPage() {
    vm.nextPage = '';
  }

  function resultsTable(selectedEntity) {

    if (!selectedEntity || !selectedEntity.currentValue) {
      return;
    }

    if (selectedEntity.currentValue !== selectedEntity.previousValue) {
        vm.resultsTable = 'scripts/results-tables/' +
                          selectedEntity.currentValue.resultsTable +
                          '.html';
        clearNextPage();
    }

  }

  function clearCopy(copy) {

    if (!copy || !copy.currentValue) {
      return 'clearCopy not set'
    }

    if (copy.currentValue){
      vm.id = 'clear';
    }

  }

  vm.$onChanges = function (changes) {

    if (!changes) {
      return;
    }

    resultsTable(changes.selectedEntity);

    clearCopy(changes.clearCopy);

  }

  vm.getNextResultSet = function() {
    /* jshint ignore:start */
    ga('IDLookup.send', 'event', 'Results', 'Get Next Page', vm.selectedEntity.displayName)
    /* jshint ignore:end */
    var nextPage = parseNextPage();

    vm.infiniteFetching = true;
    spinnerService.showGroup('loaders');
    $http.get(nextPage)
    .then(function(response){
      vm.data = vm.data.concat(response.data.data);
      vm.nextPage = response.data.meta.next_page;
    },
    function(){
      // loggly error? nothing's happened so...
    })
    .finally(function(){
      vm.infiniteFetching = false;
      spinnerService.hideGroup('loaders');
    });

  };

  vm.styleIcon = function(id, style) {
    var element = '#style'+id
    // style = 'grey' || 'black'
    var iconElement = angular.element( document.querySelector( element ))

    if (style === 'black') {
      iconElement.removeClass('text-muted')
    } else {
      iconElement.addClass('text-muted')
    }

  }

}

angular.module('ts-id-lookup')
.component('results', {

  templateUrl: 'scripts/components/results.html',
  bindings: {
    nextPage: '<',
    data: '<',
    resultsCount: '<',
    clearCopy: '<',
    selectedEntity: '<'
  },

  controller: [ 'T1URL', 'ENV', '$http', 'spinnerService', '$location', ResultsController ]

});
