#!/bin/bash -e

# identify which locations/queries failed to produce any results

query_dir=queries
results_dir=results
n_time_samples=2

function list_missing_queries {
	for geoid in $(find "${query_dir}" -type f -name "query-*.csv" | xargs -I {} tail -n +2 {} | cut -f1 -d "," | sort | uniq); do
		n=$(ls "${results_dir}/${geoid}"_* 2>/dev/null | wc -l)
		if [ "${n}" -ne "${n_time_samples}" ]; then
			grep "${geoid}" "${query_dir}"/*.csv | cut -f1 -d "," | grep "${geoid}" | cut -f1 -d ":"
		fi	
	done
}

list_missing_queries | sort | uniq
