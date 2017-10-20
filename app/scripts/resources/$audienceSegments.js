angular.module('ts-id-lookup')
.service('$audienceSegments', function(
  qParamEncodeSubStringQuery,
  $resource,
  T1URL,
  T1ApiBase) {
  'use strict';

  return $resource(T1URL + T1ApiBase + '/audience_segments/:id',
    {
      order_by: 'descending',
      page_limit: '50',
      page_offset: '0',
      sort_by: 'name',
      full: 'audience_segment'
    },
    {
      query: {
        method:'GET', isArray:false,
        params: {
          q: qParamEncodeSubStringQuery
        }
      }
    });
});
