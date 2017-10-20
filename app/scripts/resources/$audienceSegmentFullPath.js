angular.module('ts-id-lookup')
.service('$audienceSegmentFullPath', function(
  encodeSubstringQueryTerm,
  $resource,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/path_audience_segments',
    {
      order_by: 'descending',
      page_limit: '50',
      page_offset: '0',
      sort_by: '-created_on',
      full: 'audience_segment'
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
              '&' + 'audience_vendor_id==' + data.parentProviderId;
            }

          }
        }
      }
    });
});
