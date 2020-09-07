#!/bin/bash -e

# generate the query files 
# batches is the number of query files that will be generated
# each batch can be run in parallel via slurm --array
# there may be limits on how large an array in slurm can be so multiple jobs files may
# be needed e.g. 1st with --array 1 - 1000, second with --array 1001 - 2000
# a single query with 5 rows takes about 20 mins to complete

source src/modules.rc

geodata="data/akl_points.shp"
batches=1000
start_time="2020-06-01 13:00:00"
timezone="Pacific/Auckland"
time_steps=36
time_delta_minutes=10
outputdir="queries"

if [ ! -d "${outputdir}" ]; then
	mkdir "${outputdir}"
fi
rm -f queries/*.csv

Rscript src/gen_queries.R "${geodata}" "${batches}" "${start_time}" "${timezone}" "${time_steps}" "${time_delta_minutes}" "${outputdir}"
