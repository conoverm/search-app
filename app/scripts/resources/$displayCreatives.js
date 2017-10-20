angular.module('ts-id-lookup')
.service('$displayCreatives', function(
  $resource,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/atomic_creatives',
  {
    order_by: 'descending',
    page_limit: '100',
    page_offset: '0',
    full: 'atomic_creative',
    q: 'media_type==display'
  },
  {
    query: {
      method:'GET', isArray:false,
      params: {
        q: function(qparam){
          var ret = 'media_type==display';

          if (qparam && qparam.substringQuery) {
            ret = ret + '&<' + encodeURIComponent(qparam.substringQuery) + '>'
            delete qparam.substringQuery;
          }

          return ret;

        },
        with: function(data){
          return data.parentEntityType
        }
      }
    }
  })
});
