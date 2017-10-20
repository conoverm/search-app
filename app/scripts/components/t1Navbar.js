angular.module('ts-id-lookup')
.component('t1Navbar', {
  templateUrl: 'scripts/components/t1Navbar.html',
  controller: function(APPVERSION){
    'use strict';
    var vm = this;
    vm.APPVERSION = APPVERSION;
  }
});
