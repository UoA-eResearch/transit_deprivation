library(sf)
library(lubridate)

usage = function(){
  msg = "
Required arguments: 
  GEODATA: shapefile
  BATCHES: int
  START_TIME: datetime
  TIMEZONE: string
  TIME_INTERVALS: int
  TIME_INTERVAL_MINUTES: int
  OUTPUT_DIR: string
"
  return(msg)
}

# parse arguments
args = commandArgs(trailingOnly = TRUE)
if (length(args) != 7) {
  stop(usage(), call.=FALSE)
}

# params
geodata = args[1]
batches = as.integer(args[2])
start_time_str = args[3]
timezone_str = args[4]
time_intervals = as.integer(args[5])
time_interval_mins = as.integer(args[6])
output_dir = args[7]

# read points
points = st_read(geodata)
n_samples = nrow(points) * time_intervals
batch_size = as.integer(n_samples / batches) + 1

# generate base query dataframe
q = as.data.frame(do.call(rbind, st_geometry(points)))
colnames(q)[1:2] = c("lon", "lat")
q$geoid = points$OBJECTID
q$timezone = timezone_str

# time samples
start_time = as.POSIXct(start_time_str, tz=timezone_str, format="%Y-%m-%d %H:%M:%OS")
times = start_time + c(1:time_intervals - 1) * minutes(time_interval_mins)

# write query files
batch_index = 1
for (i in 1:length(times)){
  q$datetime = times[i]
  
  # generate batches
  chunks = split(q, (as.numeric(rownames(q))-1) %/% batch_size)
  for (j in 1:length(chunks)){
    qc = chunks[j][[1]]
    q_path = sprintf("%s/query-%d.csv", output_dir, batch_index)
    write.csv(qc[, c("geoid", "lon", "lat", "datetime", "timezone")], q_path, row.names=FALSE)
    batch_index = batch_index + 1    
  }
}
print(sprintf("generated %d queries", batch_index-1))
