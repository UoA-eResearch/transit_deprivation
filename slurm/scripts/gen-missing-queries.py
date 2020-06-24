#!/usr/bin/env python
from __future__ import print_function

import os
from glob import glob

results_dir = "results"
queries_dir = "queries"
missing_queries_dir = "missing_queries"

# create missing query dir
if not os.path.isdir(missing_queries_dir):
	os.mkdir(missing_queries_dir)

# read query files
query_files = glob(os.path.join(queries_dir, "*.csv"))

# read header
with open(query_files[0], 'r') as f:
	header = f.readlines()[0].strip()

# create list of individual queries
queries = []
for qf in query_files:
	with open(qf, 'r') as f:
		queries += [l.strip() for l in f.readlines()[1:]]

# create list of existing output files
result_files = glob(os.path.join(results_dir, "*.csv"))
result_files = [os.path.basename(f) for f in result_files]

def as_results_file(query):

	tokens = query.split(",")
	location = tokens[0]
	ts = tokens[3]

	for c in ['-', ':', ' ']:
		ts = ts.replace(c, '_')
	
	return location + "_" + ts + ".csv"	

# find missing queries
missing = []
for q in queries:
	name = as_results_file(q)
	if not os.path.exists(os.path.join(results_dir, name)):
		missing.append(q)

# sort by location
missing.sort(key = lambda x: x[0])
#print("Found {} missing queries".format(len(missing)))

# create new query files with missing queries
n_files = 1000
n_queries_per_file = len(missing) // n_files + 1
#print("Estimating {} queries per file".format(n_queries_per_file))

for i in range(0, n_files):
	start_idx = i * n_queries_per_file
	end_idx = start_idx + n_queries_per_file
	q = missing[start_idx:end_idx]
	if len(q) > 0:	
		s = "\n".join([header] + q) + "\n"
		fname = os.path.join(missing_queries_dir, "query-{}.csv".format(i+1))
		with open(fname, 'w') as f:
			f.write(s)
	else:
		print("Generated {} missing query files".format(i))
		break	
	

