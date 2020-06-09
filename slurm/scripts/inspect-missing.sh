#!/bin/bash -e

# shows the number of result files associated with each query location

query_dir=queries
results_dir=results
n_time_samples=2
missing="${1}"

function missing_points {
	for f in $(cat "${missing}"); do
		tail -n 2 $f | cut -f1 -d ","; 
	done
}

for geoid in $(missing_points | sort | uniq); do
	n=$(ls "${results_dir}/${geoid}"_* 2>/dev/null | wc -l)
	if [ "${n}" -ne "${n_time_samples}" ]; then
		qfile=$(grep "${geoid}" "${query_dir}"/*.csv | cut -f1 -d "," | grep "${geoid}" | cut -f1 -d ":")
		echo "${geoid}" "${n}" $qfile
	fi
done
