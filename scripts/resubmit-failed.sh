#!/bin/bash -e

cp job.sh failed.sh
#./report-missing.sh > missing.txt
queries=$(cat missing.txt | cut -f2 -d "-" | cut -f1 -d "." | sort -n | xargs | tr " " ",")
sed -i "s/--array.*$/--array ${queries}/" failed.sh
sbatch failed.sh
