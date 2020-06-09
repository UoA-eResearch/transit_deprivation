# Deprivation and Accessibility

## Related Work

* [Dynamic public transit accessibility using travel time cubes: Comparing the effects of infrastructure (dis)investments over time](https://dx.doi.org/10.1016/j.compenvurbsys.2016.10.005)
* [Temporal variability in transit-based accessibility to supermarkets](http://dx.doi.org/10.1016/j.apgeog.2014.06.012)

## Data

* [GTFS](https://developers.google.com/transit/gtfs/reference) feeds sourced for [Auckland](https://cdn01.at.govt.nz/data/gtfs.zip), [Wellington](https://www.metlink.org.nz/assets/Google_Transit/google-transit.zip) and [Christchurch](http://data.ecan.govt.nz/Catalogue/Agreement?AgreementFile=AgreementPT.htm&AgreementRequirements=UserDetails&AgreementType=AgreementPT)
* [OpenStreetMap](https://www.openstreetmap.org/) (OSM) used to build a network for walking, cycling, and driving
* New Zealand OSM data sourced from [GeoFabrik](https://download.geofabrik.de/australia-oceania/new-zealand.html), version: 2020-04-20T20:59:03Z

### Region Extents

Region extents generated via [BoundingBox](https://boundingbox.klokantech.com/) and approximate local council region boundaries

  * [Auckland](http://www.localcouncils.govt.nz/lgip.nsf/wpg_url/Profiles-Councils-by-region-Auckland): 174.1343,-37.305,175.3145,-36.0384
  * [Wellington](http://www.localcouncils.govt.nz/lgip.nsf/wpg_url/Profiles-Councils-by-region-Wellington): 174.5958,-41.623,176.3865,-40.5444
  * [Christchuruch](http://www.localcouncils.govt.nz/lgip.nsf/wpg_URL/Profiles-Councils-Christchurch-City-Council-Main?OpenDocument): 169.5063,-45.1207,174.1316,-41.8989

## Workflow

* Regions extracted from NZ OSM data using extents above
* Travel times calculated using [OpenTripPlanner](http://docs.opentripplanner.org/en/latest/Basic-Tutorial/)
* some other stuff

