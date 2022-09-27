#!/bin/bash
#
#
# Filename: json_to_csv.sh
# Author: NTPA
# Date: September 25
#
# Script uses json2csv from https://mircozeiss.com/json2csv/. Must be set up in environment 
# prior to execution.
#
#
# Script must be called from directory containing .json files

find -name "*.json" -print0 | xargs -0 -I {} basename {} .json | \
  xargs -t -I {} npx json2csv --quote "" -i {}.json -o {}.csv
