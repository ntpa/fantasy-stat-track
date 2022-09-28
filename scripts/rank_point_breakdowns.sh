#!/bin/bash
#
#
# Filename: rank_point_breakdowns.sh
# Author: NTPA
# Date: September 28
#
#
# Sort Points_* file(s) for each position and in each file sort points from highest(total points) to lowest.
# Output the result of previous operation to file(s)

filenames="Points_2022-09-27_*" # TODO: Take user input for filename(s). [HARD-CODED]
for position in QB RB WR TE DEF K
do
  echo "Ranking $position breakdowns..."
  grep $position $filenames | awk -F ":" '{ print $3"| "substr($1, 19) }' |
  # 19 represents the prefix length of input file. Only want team name 
    sed -e 's/.txt$//' | sort --ignore-leading-blanks --numeric-sort\
    --reverse > ${position}Rankings.txt # Should date be embedded in filename?
  
done 
