#!/bin/bash -e

template=$1
missing=$2
failed=failed.sl

cp "${template}" "${failed}"
#./report-missing.sh > missing.txt
queries=$(cat "${missing}" | cut -f2 -d "-" | cut -f1 -d "." | sort -n | xargs | tr " " ",")
sed -i "s/--array.*$/--array ${queries}/" "${failed}"
#sbatch failed.sh
