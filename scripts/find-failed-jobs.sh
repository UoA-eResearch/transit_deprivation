#!/bin/bash -e

log_dir=logs/jobs
for f in $(find "${log_dir}" -type f -name "*.out"); do
	n=$(grep saved "${f}" | wc -l)
	if [ $n -lt 1 ]; then
		echo "${f}"
	fi
done
