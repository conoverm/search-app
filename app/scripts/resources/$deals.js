angular.module('ts-id-lookup')
.service('$deals', function(
  encodeDealQueryTerm,
  $resource,
  T1URL,
  MediaBase) {
  'use strict';

  return $resource(T1URL + MediaBase + '/deals',
    {
      order_by: 'descending',
      page_limit: '50',
      page_offset: '0'
    },
    {
      query: {
        method:'GET', isArray:false,
        params: {
          q: function(query){

            if (!query.substringQuery) {
              return;
            }

            if (!query.attributeToQueryOn) {
              query.attributeToQueryOn = 'name';
            }

            return encodeDealQueryTerm(query.substringQuery, query.attributeToQueryOn)
          },
          strategy_id: function(query) {

            if (!query.strategyId) {
              return;
            }

            return [query.strategyId];
          },
          'owner.advertiser_id': function(query) {
            if (!query.owner || !query.owner.entityId) {
              return;
            }

            if (query.owner.entityFilter === 'Advertiser') {
              return query.owner.entityId;
            }

            return;
          },
          'owner.organization_id': function(query) {
            if (!query.owner || !query.owner.entityId) {
              return;
            }

            if (query.owner.entityFilter === 'Organization') {
              return query.owner.entityId;
            }

            return;
          },
          'owner.agency_id': function(query) {
            if (!query.owner || !query.owner.entityId) {
              return;
            }

            if (query.owner.entityFilter === 'Agency') {
              return query.owner.entityId;
            }

            return;
          },
          'permissions.advertiser_id': function(query) {
            if (!query.permissions || !query.permissions.entityId) {
              return;
            }

            if (query.permissions.entityFilter === 'Advertiser') {
              return query.permissions.entityId;
            }

            return;
          }
        }
      },
      singleDeal: {
        method:'GET', isArray:false,
        url: T1URL + MediaBase + '/deals/:id'
      }
    });
});
