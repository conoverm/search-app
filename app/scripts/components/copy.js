// jshint ignore: start
function CopyController(FileSaver, Blob) {

  'use strict';

  var vm = this;

  vm.copyObjArray = []
  vm.copyArray = []

  vm.exportResults = function(){

    ga('IDLookup.send', 'event', 'XLSX', 'Export Results Table to XLSX', vm.parentCtrl.selectedEntity.displayName)

    /* XLSX is global -- once we move to webpack we'll stop getting the XLSX undefined error
      because we'll `import` it */

    var workbook = XLSX.utils.book_new()
    var resultsSheet = XLSX.utils.json_to_sheet(JSON.parse(angular.toJson(vm.parentCtrl.data)));

    XLSX.utils.book_append_sheet(workbook, resultsSheet)

    var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
    var wbout = XLSX.write(workbook,wopts);

    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    }

    FileSaver.saveAs(new Blob([s2ab(wbout)], {type:'application/octet-stream'}),
      'IdLookup' + vm.parentCtrl.selectedEntity.displayName + '.xlsx');
  }

  vm.exportEnable = function () {
    if (vm.parentCtrl.data && vm.parentCtrl.data.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  vm.$onChanges = function (changes) {

    if (!changes.sentId) { return }

    if (changes.sentId.currentValue === undefined || changes.sentId.currentValue === false) {
      return 'currentValue not set';
    }

    if (changes.sentId.currentValue === 'clear') {
      vm.clearArray()
    } else {
      var newStr = changes.sentId.currentValue
      var newObj = {text: changes.sentId.currentValue}
      if (vm.copyArray.indexOf(newStr) === -1) {
        vm.copyArray.push(newStr);
        vm.copyObjArray.push(newObj);
      }
    }
  }

  vm.checkArray = function(){
    if (vm.copyArray.length > 0){
      return false;
    } else {
      return true;
    }
  }

  vm.clearArray = function(){
    for (var id=0; id<vm.copyArray.length;id++){
      vm.parentCtrl.styleIcon(vm.copyArray[id],'black')
    }
    vm.copyObjArray = [];
    vm.copyArray = [];
    vm.parentCtrl.storeId(false)
  }

  vm.copyToString = function() {
    var copyString = '';

    vm.copyObjArray.forEach (function(item){
      copyString = copyString.concat(String(item.text)+';')
    })

    copyString = copyString.substring(0, copyString.length - 1)

    return copyString;
  }

  vm.updateParent = function(tag){
    var index = vm.copyArray.indexOf(tag.text);
    vm.copyArray.splice(index,1)
    vm.parentCtrl.styleIcon(tag.text,'black')
    vm.parentCtrl.storeId(false)
  }
}

angular.module('ts-id-lookup').component('copy', {
  require:{
    parentCtrl:'^results'
  },

  templateUrl: 'scripts/components/copy.html',

  bindings: {
    sentId: '<'
  },

  controller: CopyController

});
