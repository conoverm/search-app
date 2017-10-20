function TitleController() {
  'use strict';

  this.title = 'Entity Lookup';
}

angular.module('ts-id-lookup')
.component('titleComponent', {

  templateUrl: 'scripts/components/titleComponent.html' ,

  controller: TitleController

});
