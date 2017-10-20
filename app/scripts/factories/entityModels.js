function models(
  $generic,
  $adServer,
  $agencies,
  $videoCreatives,
  $displayCreatives,
  $organizations,
  $campaigns,
  $strategies,
  $siteLists,
  $pixels,
  $supply_sources,
  $vendors,
  $deals,
  $audienceSegments,
  $audienceSegmentTaxonomy,
  $audienceSegmentAssignedToStrategy,
  $audienceSegmentFullPath,
  $targetVendors,
  $targetObjectives,
  $targetSegments,
  $targetSegmentChildren,
  $targetFullPath,
  $targetSegmentAssignedToStrategy,
  $targetDimensions,
  $atomicCreatives,
  $advertisers) {

  'use strict';

  // `endPoint` is only necessary if the resource is `$generic`.
  // A specific $resource by definition has a specific `endPoint`.
  // IE: 'ad_servers' has no endPoint and a specific $resource.

  var models = {

    'organizations': {
      displayName: 'Organizations',
      resource: $organizations,
      resultsTable: 'organizations',
      childEntityType: 'seats'
    },
    'agencies': {
      displayName: 'Agencies',
      resource: $agencies,
      parentEntityType: 'organization',
      resultsTable: 'agencies'
    },
    'advertisers': {
      resultsTable: 'advertisers',
      displayName: 'Advertisers',
      resource: $advertisers,
      parentEntityType: 'agency',
      childEntityType: 'campaign'
    },
    'campaigns': {
      resultsTable: 'campaigns',
      displayName: 'Campaigns',
      resource: $campaigns,
      parentEntityType: 'advertiser',
      childEntityType: 'strategy'
    },
    'strategies': {
      resultsTable: 'strategies',
      displayName: 'Strategies',
      resource: $strategies,
      parentEntityType: 'campaign',
      sibling: { 'supply': '/supplies' , 'day_parts': '/day_parts' }
    },
    'concepts': {
      resultsTable: 'concepts',
      endPoint: 'concepts',
      displayName: 'Concepts',
      resource: $generic,
      parentEntityType: 'advertiser'
    },
    'creative_check': {
      minlength: 4,
      placeholder: 'Enter a creative ID to check its status',
      resultsTable: 'creativeCheck',
      displayName: 'Creative Check',
      resource: $atomicCreatives,
      parentEntityType: 'concept'
    },
    'atomic_creatives': {
      resultsTable: 'creatives',
      displayName: 'Creatives',
      resource: $atomicCreatives,
      parentEntityType: 'concept'
    },
    'display_creatives': {
      resultsTable: 'creatives',
      displayName: 'Display Creatives',
      resource: $displayCreatives,
      parentEntityType: 'concept'
    },
    'video_creatives': {
      resultsTable: 'creatives',
      displayName: 'Video Creatives',
      resource: $videoCreatives,
      parentEntityType: 'concept'
    },
    'site_lists': {
      resultsTable: 'site_lists',
      displayName: 'Site Lists',
      resource: $siteLists,
      parentEntityType: 'organization'
    },
    'deals': {
      placeholder: 'Query on a PMP-E name, External Id, Supply Source Id, or Strategy Id',
      extraQueryTemplate: 'pmpeDeals',
      queryFilter: {
        owner: {
          entityType: ['Internal', 'Advertiser', 'Agency', 'Organization']
        },
        permissions: {
          entityType: ['Advertiser']
        },
        AttributeToQueryOn: 'name'
      },
      resultsTable: 'pmpe-deals',
      displayName: 'PMP-E Deals',
      resource: $deals
    },
    'pixel_bundles': {
      resultsTable: 'pixels',
      displayName: 'My Data',
      resource: $pixels,
      parentEntityType: 'advertiser,agency,organization'
    },
    'supply_sources': {
      resultsTable: 'supply_sources',
      displayName: 'Supply Sources',
      resource: $supply_sources
    },
    'ad_servers': {
      resultsTable: 'ad_servers',
      displayName: 'Ad Servers',
      resource: $adServer
    },
    'audience_segment_ids': {
      resultsTable: 'audienceSegments',
      displayName: 'Audience Segment Ids',
      resource: $audienceSegments,
      placeholder: 'Search using a single Segment Id'
    },
    'audience_segment_providers': {
      resultsTable: 'audienceSegments',
      displayName: 'Audience Segment Providers',
      resource: $audienceSegments,
      placeholder: 'Search the names of Audience Segment Providers'
    },
    'audience_segments_taxonomy': {
      resultsTable: 'audienceSegmentTaxonomy',
      displayName: 'Audience Segment Taxonomy',
      resource: $audienceSegmentTaxonomy,
      placeholder: 'Use an Audience Segment Id to get the immediate children of the Audience Segment'
    },
    'audience_segments_full_path': {
      resultsTable: 'audienceSegmentTaxonomy',
      displayName: 'Audience Segment Full Path',
      resource: $audienceSegmentFullPath,
      placeholder: 'Search on the name of Audience Segments',
      queryFilter: {
        provider: 'audience_segment_providers',
        parentProviderList: [{name: 'No Filter'}]
      },
      extraQueryTemplate: 'parentProvider'
    },
    'assigned_audience_segments': {
      resultsTable: 'assignedAudienceSegments',
      displayName: 'Assigned Audience Segments',
      resource: $audienceSegmentAssignedToStrategy,
      placeholder: 'Search using a Strategy ID for Audience Segments assigned to the strategy'
    },
    'target_dimensions': {
      extraQueryTemplate: 'targetDimensions',
      queryFilter: {
        targetDimension: 'BSER',
        targetDimensionParent: undefined
      },
      resultsTable: 'targetDimensionsAndValues',
      displayName: 'Target Dimensions',
      resource: $targetDimensions,
      placeholder: 'Query various Target Dimensions'
    },
    'target_vendors': {
      resultsTable: 'targetVendors',
      displayName: 'Targeting Vendors',
      resource: $targetVendors
    },
    'target_objectives': {
      resultsTable: 'results',
      displayName: 'Targeting Segment Objectives',
      resource: $targetObjectives,
      placeholder: 'Hit enter to get all objectives'
    },
    'target_segment_ids': {
      resultsTable: 'targetSegmentChildren',
      displayName: 'Targeting Segment Ids',
      resource: $targetSegments,
      placeholder: 'Search using a single Targeting Id'
    },
    'target_segment_children': {
      resultsTable: 'targetSegmentChildren',
      displayName: 'Targeting Segment Children',
      resource: $targetSegmentChildren,
      placeholder: 'enter Segement ID to see children'
    },
    'target_full_path': {
      resultsTable: 'targetSegmentChildren',
      displayName: 'Targeting Segment Full Path',
      resource: $targetFullPath,
      placeholder: 'Query on the name of Targeting Segments',
      queryFilter: {
        provider: 'target_vendors',
        parentProviderList: [{name: 'No Filter'}]
      },
      extraQueryTemplate: 'parentProvider'
    },
    'target_segment_assigned_to_strategy': {
      resultsTable: 'targetSegmentAssignedToStrategy',
      displayName: 'Targeting Segment Assigned to Strategy',
      resource: $targetSegmentAssignedToStrategy,
      placeholder: 'Enter Strategy ID to see segments assigned to the strategy'
    },
    'vendors': {
      resultsTable: 'vendors',
      displayName: 'Vendors',
      resource: $vendors
    }

  }

  return models;

}

angular.module('ts-id-lookup').factory('entityModels', models);
