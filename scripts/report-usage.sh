#!/bin/bash

# report sacct stats for each jobid
# https://slurm.schedmd.com/sacct.html
for j in $(find logs/jobs -type f -name "*.out" | grep -oE "[[:digit:]]{7,}"); do
	sacct --units=G --format="JobID,Elapsed,MaxRSS,State" -j "${j}" | tail -n 2 | head -n 1
done
