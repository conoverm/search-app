angular.module('ts-id-lookup')
.service('$audienceSegmentTaxonomy', function(
  encodeSubstringQueryTerm,
  $resource,
  T1URL,
  T1ApiBase,
  fullQueryParam) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/audience_segments',
    fullQueryParam,
    {
     query: {
        method:'GET', isArray:false,
        params: {
          parent: function(data){
            return data.substringQuery
          }
        }
      }
    });
});
