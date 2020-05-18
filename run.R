# libraries
library(lubridate)
library(opentripplanner)
library(tmap)
library(dplyr)
library(sf)

usage = function(){
  msg = "
Required arguments: 
  OTP_ROUTER: string
  OTP_PORT: int
  GEODATA: shapefile
  QUERY: csv (geoid, lon, lat, datetime, timezone)  
"
  return(msg)
}

# parse arguments
args = commandArgs(trailingOnly = TRUE)
if (length(args) == 0) {
  stop(usage(), call.=FALSE)
}

# argument params
router = args[1]
port = as.numeric(args[2])
geodata = args[3]
query = args[4]

# default params
mode = c("TRANSIT", "WALK")
itineraries = 1
ncores = Sys.getenv("SLURM_CPUS_PER_TASK")
ncores = if (ncores != "") as.numeric(ncores) else 1

# report params
cat(sprintf("router: %s\nport: %d\ngeodata: %s\nquery: %s\nmode: %s\nncores: %d\n", router, port, geodata, query, paste(mode, collapse=", "), ncores))

# read query and geodata
points = st_read(geodata)
q = read.csv(query)

# establish OTP connection
otpcon <- otp_connect(hostname="localhost", router=router, port=as.numeric(port)) 

# calculates expected time of arrival in routing results
# q_time is in global scope for each row in the query
eta = function(x){
  t = unlist(x, use.names = FALSE)
  dt = as.numeric(difftime(as.POSIXct(t, origin="1970-01-01"), rep(q_time, length(t))))
  return(min(dt))
}

# build routing parameters (locations are lon, lat pairs)
locations = do.call(rbind, st_geometry(points)) 
location_ids = cbind(as.character(points$OBJECTID))
toPlace   = locations[rep(seq(1, nrow(locations)), times = nrow(locations)),]
toID = location_ids[rep(seq(1, nrow(location_ids)), times = nrow(location_ids)),]

# process each query row
for (i in 1:nrow(q)){
  
  fromPlace = matrix(as.matrix(q[i, 2:3]), nrow=nrow(toPlace), ncol=2, byrow=TRUE)
  fromID = matrix(as.character(q[i,1]), nrow=nrow(toPlace), ncol=1, byrow=TRUE)
  q_time = as.POSIXct(q[i, 4], tz=as.character(q[i, 5]), format="%Y-%m-%d %H:%M:%OS")
  
  # get routes
  routes = otp_plan(otpcon, fromPlace=fromPlace, toPlace=toPlace, mode=mode, fromID=fromID, toID=toID,
                    date_time=q_time, get_geometry=FALSE, ncores=ncores, numItineraries=itineraries)
  routes_fltr = routes[, c("fromPlace", "toPlace", "endTime")]
  routes_matrix = tidyr::pivot_wider(routes_fltr, names_from = "toPlace", values_from = "endTime", values_fn=list(endTime=eta))
  # otp_plan will return NA for self-self routes, replace these with 0
  routes_matrix[is.na(routes_matrix)] = 0  
}