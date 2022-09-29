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

# TODO: Insert your filename(s). May be wildcard name such as "Points_2022-09-28*"
# [HARD-CODED]
filenames="Points_2022-09-28_*" 

for position in QB RB WR TE DEF K
do
  echo "Ranking $position breakdowns..."
  out1=`date "+%Y-%m-%d"`_${position}_RankByTotal.txt
  out2=`date "+%Y-%m-%d"`_${position}_RankByAvg.txt
  grep $position $filenames | awk -F ":" '{ print $3"| "substr($1, 19) }' |
  # 19 represents the prefix length of input file. Only want team name 
    sed -e 's/.txt$//' | sort --ignore-leading-blanks --numeric-sort\
    --reverse | sed -e 's/^ //' > $out1

  # Rank by Average
  cat $out1 | sort -t "[" -k 2 -n -r > $out2
  
done 
