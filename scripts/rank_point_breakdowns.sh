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

# TODO: Insert your filename(s) you wish to operate on. 
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
  out1=${current_date}_${position}_RankByTotal.txt
  out2=${current_date}_${position}_RankByAvg.txt
  # 19 represents the prefix length of input file. Only want team name 
  grep $position $filenames | awk -F ":" '{ print $3"| "substr($1, 19) }' |
    sed -e 's/.txt$//' | sort --ignore-leading-blanks --numeric-sort\
    --reverse | sed -e 's/^ //' > $out1

  # Rank by Average
  sort -t "[" -k 2 -n -r $out1 > $out2


  # Top teams by position points total
  for file in ${current_date}_?*_RankByTotal.txt; do head -n 2 $file;  echo ""; done > ${current_date}_TopPerformersByTotal.txt
  # Botom two teams by position points total
  for file in ${current_date}_?*_RankByTotal.txt; do tail -n 2 $file;  echo ""; done > ${current_date}_LowPerformersByTotal.txt

  # Top two teams by position points Average
  for file in ${current_date}_?*_RankByAvg.txt; do head -n 2 $file;  echo ""; done > ${current_date}_TopPerformersByAvg.txt
  # Bottom two teams by position points average
  for file in ${current_date}_?*_RankByAvg.txt; do tail -n 2 $file;  echo ""; done > ${current_date}_LowPerformersByAvg.txt


done 
