#!/bin/bash

# region params
router=auckland
#data=data/sample.shp
data=data/points_akl.shp
query="debug.csv"

# common params
array_id=debug
host=$(hostname)
port=8080
outdir=results
echo -e "hostname: ${host}\narray_id: \"${array_id}\"\nport: ${port}\ndata: ${data}\nquery: ${query}\noutdir: ${outdir}"

# start otp in the background
otp/run.sh "${router}" "${port}" > "logs/otp/otp-${array_id}".log 2>&1 &

# wait for otp to load
sleep 20

# run otp queries
source src/modules.rc
Rscript src/run.R "${router}" "${port}" "${data}" "${query}" "${outdir}"

# stop otp
otp_job_id=$(ps -ef | grep otp | grep jar | tr -s " " | cut -d " " -f2)
kill "${otp_job_id}"
