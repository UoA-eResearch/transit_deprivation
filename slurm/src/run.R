
start_time = proc.time()

# libraries
library(lubridate)
library(opentripplanner)
#library(tmap)
library(dplyr)
library(sf)

usage = function(){
  msg = "
Required arguments: 
  OTP_ROUTER: string
  OTP_PORT: int
  GEODATA: shapefile
  QUERY: csv (geoid, lon, lat, datetime, timezone)  
  OUTPUT_DIR: string
"
  return(msg)
}

# parse arguments
args = commandArgs(trailingOnly = TRUE)
if (length(args) != 5) {
  stop(usage(), call.=FALSE)
}

# argument params
router = args[1]
port = as.numeric(args[2])
geodata = args[3]
query = args[4]
outputdir = args[5]

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
otpcon = otp_connect(hostname="localhost", router=router, port=as.numeric(port)) 

# process queries
# build routing parameters (locations are lon, lat pairs)
toPlace = do.call(rbind, st_geometry(points)) 
toID = cbind(as.character(points$DZ2018))

# process each query row (locations are in lon, lat pairs)
for (i in 1:nrow(q)){
  
  fid = as.character(q[i,1]) # origin id
  q_time = as.POSIXct(q[i, 4], tz=trimws(as.character(q[i, 5])), format="%Y-%m-%d %H:%M:%OS")
  
  # check if this result has already been generated
  tstring = gsub("[:-]", "_", q_time)
  tstring = gsub(" ", "_", tstring)
  respath = sprintf("%s/%s_%s.csv", outputdir, fid, tstring) 
 
  # skip already generated results
  if (!file.exists(respath)) {
    
    # destinations 
    to_points = points[points$DZ2018 != as.numeric(fid),]
    to_place = do.call(rbind, st_geometry(to_points)) 
    to_id = cbind(as.character(to_points$DZ2018))
    
    # origins
    from_place = matrix(as.matrix(q[i, 2:3]), nrow=nrow(to_place), ncol=2, byrow=TRUE)
    from_id = matrix(fid, nrow=nrow(to_place), ncol=1, byrow=TRUE)    
    
    # get routes
    routes = otp_plan(otpcon, fromPlace=from_place, toPlace=to_place, mode=mode, fromID=from_id, toID=to_id,
                      date_time=q_time, get_geometry=FALSE, ncores=ncores, numItineraries=itineraries)
 
    if (is.na(routes)){
      # no routes returned, use only default case
      result = as.data.frame(rbind(c(fid, fid, 0)))
      colnames(result) = c("fromPlace", "toPlace", "eta")
      result$eta = as.numeric(as.character(result$eta))
    } else {

	    # process eta
	    routes$eta = as.numeric(difftime(routes$endTime, rep(q_time, nrow(routes))))
    
	    # remove duplicates (routes data is repeated for each trip component)
	    result = distinct(routes[, c("fromPlace", "toPlace", "eta")])
    
    	# add self-self as otp will return error on this
	    result = rbind(result, list(fid, fid, 0))
	}
    
	# to allow joins
	result$fromPlace = as.numeric(as.character(result$fromPlace))
	result$toPlace = as.numeric(as.character(result$toPlace))
    
	# add query time
	result$queryTime = rep(q_time, nrow(result))
    
    # save result
	#points_eta = left_join(points, result, by = c(DZ2018 = "toPlace"))
	write.csv(result[, c("fromPlace", "toPlace", "queryTime", "eta")], respath, row.names=FALSE)
	print(paste("saved results to:", respath))

  } else {
    print(paste("skipping", respath, "file exists"))
  }
}

# report runtime
proc.time() - start_time
