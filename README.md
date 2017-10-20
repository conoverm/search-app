[![Build Status](https://jenkins.mediamath.com/buildStatus/icon?job=ts_id_lookup)](https://jenkins.mediamath.com/job/ts_id_lookup)

# ts-id-lookup

## Description

Id Lookup is a simple search app for the T1 platform. It can query across the majority of the most heavily-used entities in the "Organization Tree" (Org > Agency > Advertiser), Targeting Segments, Audience Segments, Supply Sources, PMP-E Deals, and a few other miscellaneous entities.  

## Stack

ID Lookup is an Angular >1.6.5 application with a very thin Connect middleware for serving static assets and proxying requests to APIs. The middleware contains a feature called "Creative Check" which simply takes an ad tag, renders it to a tiny HTML page for purposes of seeing if it actually loads, then deletes the HTML page from the middleware memory.

## Build

The build system is heavily modified and expanded version of the Angular HTML5 Boilerplate open source project. The build system uses Bower, which is maintained but deprecated. The next major change to ID Lookup should consist of porting it to a framework that doesn't have an expiration date, as Angular 1.x does.

The most common commands are:

`npm run dev` or `grunt serve --environment=dev` for local development.

`npm test` or `grunt test` for running all available unit, integration, and functional tests in all browsers available to Karma.

`grunt test:cont` for test development.

`grunt serve --environment=prod` for testing a "production" version of the app: minified and concatenated scripts and CSS, etc.

`grunt build --environment={{dev|qa|prod|aws}}` for building the application for various environments.

`grunt serve` starts a web server for the application and a Connect server for the `test/mocks/` directory to reduce fetching of remote resources if desired.

`npm run eb-deploy` build project for serving on AWS Beanstalk and deploy it.

## Deployment

If you have an AWS account on the Swift team you can deploy ID Lookup in about a minute. ID Lookup deploys to Elastic Beanstalk under the Swift team's AWS account. 

[Install EB CLI](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install-osx.html). Homebrew is the easiest method here. [Read Using the EB CLI with Git](http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb3-cli-git.html)

The thing to understand most with EB CLI is that everything it does can be done through the AWS web console. Using EB CLI is far easier for deployments. It automates several steps that you have to do manually using the web console. EB CLI deploys **committed** code, unless the project has an `.ebignore` file. This project has an `.ebignore` that makes the EB CLI only deploy EB-related command files and the `/dist` directory.

### Setting up EB CLI

- run `eb init` and consulting the [AWS EBS Web Console](https://console.aws.amazon.com/elasticbeanstalk/) answer the questions accurately.
- You'll need to setup a key pair if you don't have one. Create one **only if** you need to log into the environment and debug something very tricky. **Production deployments should never have SSH access**. If your environment is broken for some reason terminate it and deploy a new one.

### Deploy the Application to EBS

If you're doing a "production" deployment:
- run `eb list`
- pick the correct environment with `eb use [environment name]`. As of 10/4/17 the "master" environment name is "acs-v430-idlookup-swift". Route 53 points to environment using the CNAME: "idlookup-swift". If you want to change CNAMEs, you'll need to update Route 53 to point to the environment with the new CNAME. I can't imagine why you would need or want to do this.
- `npm run eb-deploy`. If the operation is successful, you're done.

If you're doing a non-production deployment, like a UAT deployment:
- Run `eb create [new UAT environment name, eg: mc-new-search]` EB CLI will give you the full url to what we're calling a UAT environment. It will look something like `mc-new-search.gasdfa2345.aws.beanstalk.com`. Take that ugly URL EB CLI gave you and use it in the next step.
- Do a one-off update of T1URL in `ngconstant:aws` section of the Gruntfile
- Using `eb list` and `eb use` make sure you're about to deploy the new environment you just created.
- Run `npm run eb-deploy`. If the operation is successful you should have deployed the UAT version of the app. Before you make a PR, undo your changes to the T1URL in the Gruntfile.

## Continuous Integration

Branches must pass unit tests, JSHint, and code review before merging. It is vastly preferable to include unit tests in the initial PR, rather than make a second branch with unit tests.

## Diagram

[gliffy diagram](https://www.gliffy.com/go/share/sieg19ph5rfo9x84g6nj)

## Enhancements

 - Auth check on App run
 - The infinite scroll plugin only watches on window scroll. Change this to an infinite scroll plugin that watches either the window or the containing element.
 - add Mobile ID-App Name lookup to entities list. Currently a Chin Lun, PI_Tools app could be added to ID Lookup. Querying one ID/Name does not cost money. https://github.com/MediaMath/pi-tools/blob/master/app/static/js/mobileinappidquery.js
- add Forex API: https://github.com/MediaMath/knox-forex-api, https://pi.mediamath.com/apps/forex/api/v1/rates, https://pi.mediamath.com/apps/forex/api/v1/codes, and available queries
- State management was added recently but is mostly unused. Would be useful to update URL to specific search on both query switch and on an actual query.
Eg: /#/main -> user switches entity to strategies -> /#/strategies -> user queries -> /#/strategies/some+user+query
- Keyboard shortcuts while querying. 
Eg: user types strategies:764839 -> state change to entity selected strategy, $location updates, app sends query

## Proposed Entity Phases

| Phase 1									| Phase 2 										| Phase 3/Never |
|--------									|---------										|---------------|
| Advertisers​ *v1*							| Adaptive Segs **BSV1** 						| Verticals​ |
| Agencies​ *v1*								| Audience Segments **CPLX** *v1*				| Creative Classification Options **external API** |
| Campaigns​ *v1*							|  												| Pixel Providers​ |
| Concepts **BSV1** *v1*					| Contextual Maturity+UGC Options **CPLX**		| Publishers​ |
| Pixel Bundles **BSV1** *v1*				| Contextual Segments **CPLX** *v1*				| Concept Weighting Types* |
| Ad Servers **CPLX** *v1*					| Fold Targeting Options **CPLX** *v1*			| Organization Seats `/orgs/:id/seats`
| Open Supply Sources **BSV1** *v1*			| Geo-fences *external API*
| Organizations *v1*						| Location Targeting Options **CPLX** *v1*
| PMP-E Deals **BSV1** *v1*					| Technology Targeting Options **CPLX** *v1*
| Site Lists *v1*							| Video Targeting Options **CPLX** 
| Strategies *v1*							| Vendor Agreements **BSV1**
| Vendors​ *v1*								| 

*Concept Weighting Types is not an entity. It's two different strings. 

Technology Targeting Options 

| label | Definition |
|-------	|-------------|
| **BSV1**	|  Items listed for Bulk Sheets							|
| CPLX		| Complex entity. May not have parent-child heirarchy 	|
| *v1*		| Released in [v1.*.*](https://github.com/MediaMath/ts-id-lookup/tree/1.0.0) |

#### Tips and Tricks

Don't forget the secret debug route for Adama entities. It's in the form:
https://api.mediamath.com/api/v2.0/debug/db_class_dump/Strategy

