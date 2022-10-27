# !/usr/bin/env bash
#
# Filename: rank_point_breakdowns.sh
# Author: NTPA
# Date: September 28
#
#
# Sort Points_* file(s) for each position and in each file sort points from highest(total points) to lowest.
# Output the result of previous operation to file(s)

# By default, the script will search files with the current date prefixed 
# in the filename. The assumption is the script create_point_breakdowns.sh 
# is run prior, and populates the working directory with files point breakdown files  
#
#
# That being said, this script is meant to be run in tandem with create_point_breakdowns.sh
# Please review the README.md for usage 

current_date=$(date "+%Y-%m-%d")
# filenames="Points_2022-09-28_*" 
filenames=Points_${current_date}_*

for position in QB RB WR TE DEF K
do
  echo "Ranking $position breakdowns..."
  out=${current_date}_${position}_RankByAvg.txt
  # 19 represents the prefix length of input file. Only want team name 
  # Rank by Average

  grep $position $filenames | awk -F ":" '{ print $3"| "substr($1, 19) }' |
    sed -e 's/.txt$//' | sort --ignore-leading-blanks --numeric-sort\
    --reverse | sed -e 's/^ //' | sort -t "[" -k 2 -n -r --output=$out

  # Top two teams by position points Average
  for file in ${current_date}_?*_RankByAvg.txt; do head -n 2 $file;  echo ""; done > ${current_date}_TopPerformersByAvg.txt
  # Bottom two teams by position points average
  for file in ${current_date}_?*_RankByAvg.txt; do tail -n 2 $file;  echo ""; done > ${current_date}_LowPerformersByAvg.txt


done 
