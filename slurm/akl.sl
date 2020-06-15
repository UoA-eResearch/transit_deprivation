#!/bin/bash -e

#SBATCH --job-name    OTP
#SBATCH --time        02:00:00
#SBATCH --array       3-1000 # total is 4860
#SBATCH --mem         10gb
#SBATCH --output      logs/jobs/job-%A-%a.out 
#SBATCH --error       logs/jobs/job-%A-%a.err 

# region params
router=auckland
data=data/akl_points.shp

# common params
host=$(hostname)
port=8080
array_id="${SLURM_ARRAY_TASK_ID}"
if [ ! -z "${array_id}" ]; then
	let port=8000+${array_id}
fi
query="queries/query-${array_id}.csv"
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
