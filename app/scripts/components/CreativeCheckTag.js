function CreativeCheckTagController(T1URL, T1ApiBase, $http) {
  'use strict';
  var vm = this;

  vm.$onChanges = function (changes) {
    vm.conceptStrategyLink = [];
    vm.tempCreativePageCreated = false;
    vm.iframe = {
      src: '',
      style: 'width:100%;height:300px'
    };

    var frameHeight;

    if (!changes || !changes.creative || !changes.creative || !changes.creative.currentValue) {
      return;
    }

    if (changes.creative.currentValue.height && Number(changes.creative.currentValue.height)) {
      frameHeight = Number(changes.creative.currentValue.height) + 45;
      frameHeight = frameHeight + 'px';
      vm.iframe.style = 'width:100%;height:' + frameHeight;
    }

    $http.post('/creativeCheck', {
      id: changes.creative.currentValue.id,
      tag: changes.creative.currentValue.tag
    })
    .then(function(res){
      vm.tempCreativePageCreated = true;
      vm.iframe.src = res.data.creativeCheckUrl;
    })
    .catch(function(err){
      return err;
    });

    $http.get(T1URL + T1ApiBase +
      '/strategies/limit/strategy_concepts.concept=' +
      changes.creative.currentValue.concept_id +
      '?with=campaign,advertiser,agency,organization&full=strategy,campaign')
    .then(function(res) {
      vm.conceptStrategyLink = res.data.data.length === 0 ?
        false :
        res.data.data;
    })
    .catch(function(err){
      return err;
    });
  }
}

angular.module('ts-id-lookup')
.component('creativeCheckTag', {

  templateUrl: 'scripts/components/creativeCheckTag.html',
  bindings: {
    creative: '<'
  },

  controller: [ 'T1URL', 'T1ApiBase', '$http', CreativeCheckTagController ]

})
