#!/bin/bash

# report the running time of successful jobs using the output from R
# report-usage.sh is better as it is based on the slurm database
find logs/jobs/ -type f -name "*.out" -exec tail -n 1 {} \;
