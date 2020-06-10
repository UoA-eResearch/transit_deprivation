# Transit and Devprivation

The project looks at the relationship between accessibility to services via public transport and how this relates to measures of deprivation in New Zealand

## Related Work

* [Dynamic public transit accessibility using travel time cubes: Comparing the effects of infrastructure (dis)investments over time](https://dx.doi.org/10.1016/j.compenvurbsys.2016.10.005)
* [Temporal variability in transit-based accessibility to supermarkets](http://dx.doi.org/10.1016/j.apgeog.2014.06.012)

## Data

* [GTFS](https://developers.google.com/transit/gtfs/reference) feeds sourced for [Auckland](https://cdn01.at.govt.nz/data/gtfs.zip), [Wellington](https://www.metlink.org.nz/assets/Google_Transit/google-transit.zip) and [Christchurch](http://data.ecan.govt.nz/Catalogue/Agreement?AgreementFile=AgreementPT.htm&AgreementRequirements=UserDetails&AgreementType=AgreementPT)
* [OpenStreetMap](https://www.openstreetmap.org/) (OSM) used to build a network for walking, cycling, and driving
* New Zealand OSM data sourced from [GeoFabrik](https://download.geofabrik.de/australia-oceania/new-zealand.html), version: 2020-04-20T20:59:03Z
* Region boundaries sourced from [GDAM](https://gadm.org/)

## Workflow

* Travel times calculated using [OpenTripPlanner](http://docs.opentripplanner.org/en/latest/Basic-Tutorial/)
* TODO document setting up OTP, using osmconvert and any other preprocessing steps. For now see this [basic OTP tutorial](http://docs.opentripplanner.org/en/latest/Basic-Tutorial/)

