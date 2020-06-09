#!/bin/bash -e

template=$1 # jobfile to use
missing=$2 # generated from report-missing.sh
failed=failed.sl # output jobfile

cp "${template}" "${failed}"
#./report-missing.sh > missing.txt
queries=$(cat "${missing}" | cut -f2 -d "-" | cut -f1 -d "." | sort -n | xargs | tr " " ",")
sed -i "s/--array.*$/--array ${queries}/" "${failed}"
#sbatch failed.sh
