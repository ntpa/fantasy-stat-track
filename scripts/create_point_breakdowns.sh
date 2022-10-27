#!/usr/bin/env bash
#
#
# Filename: create_point_breakdowns.sh
# Author: NTPA
# Date: September 25
#
# Script uses json2csv from https://mircozeiss.com/json2csv/. Must be set up in environment 
# prior to execution.
#
#
# Script must be called from directory containing .json files

# Transfer to CSV format. 
#   Command arguments -print0 and -0 chosen to allow for spaces
#     in filename that is processed


current_date=$(date "+%Y-%m-%d")

find -name "${current_date}*.json" -print0 | xargs -0 -I {} basename {} .json | \
  xargs -t -I {} npx json2csv --quote "" -i {}.json -o {}.csv

# Create points breakdown plain text files
find -name "${current_date}*.csv" -print0 | xargs -0 -I {} basename {} .csv | xargs -t -I {} sh -c '../../scripts/./point_breakdown.awk "{}".csv > Points_"{}".txt'
