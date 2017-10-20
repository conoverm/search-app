angular.module('ts-id-lookup')
.service('$targetFullPath', function(
  $resource,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/path_targeting_segments',
    {
      order_by: 'descending',
      page_limit: '50',
      page_offset: '0',
      sort_by: '-created_on',
      full: 'path_targeting_segment'
    },
    {
      query: {
        method:'GET', isArray:false,
        params: {
          q: function(data) {
            if (!data.substringQuery) { data.substringQuery = ''; }

            if (!data.parentProviderId) {
              return 'name=:*' + encodeURIComponent(data.substringQuery) + '*';
            } else {
              return 'name=:*' + encodeURIComponent(data.substringQuery) + '*' +
              '&' + 'targeting_vendor_id==' + data.parentProviderId;
            }

          }
        }
      }
    });
});
