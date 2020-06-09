#!/bin/bash -e

rm -f queries/*.csv

source src/modules.rc

geodata="data/points_akl.shp"
batches=1000
start_time="2020-05-14 09:00:00"
timezone="Pacific/Auckland"
time_steps=2
time_delta_minutes=15
outputdir="queries"

Rscript src/gen_queries.R "${geodata}" "${batches}" "${start_time}" "${timezone}" "${time_steps}" "${time_delta_minutes}" "${outputdir}"
