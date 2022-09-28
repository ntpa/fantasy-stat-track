#!/bin/awk -f
#
# Filenmae: point_breakdown.awk
# Author: NTPA
# Date: September 23, 2022
#
#  Simple report on points. Varies from 'Points For' on NFL Fantasy Standings, because
#  that calculation only sums points from matchups(i.e. players on starting roster, not
#  including bench players). While the calculations below sums total points on whole team.
#



BEGIN { FS = "," }

$2 !~ "position" { points[$2] += $3; count[$2]++ }

END {
      team_points = points["QB"] + points["RB"] + points["WR"] + points["TE"] + points["K "] + points["DEF"]
      printf("\nTotal Points: %.2f\n\n", team_points)
      # 'Manual' printf chosen over for loop(x in y) control flow becauase order in which
      # the subscripts are considered is implementation specific. 
      printf("%s Points: %.2f (%.2f%% of team's total)\n", "QB", points["QB"], points["QB"]/team_points*100)
      printf("%s Points: %.2f (%.2f%% of team's total)\n", "RB", points["RB"], points["RB"]/team_points*100)
      printf("%s Points: %.2f (%.2f%% of team's total)\n", "WR", points["WR"], points["WR"]/team_points*100)
      printf("%s Points: %.2f (%.2f%% of team's total)\n", "TE", points["TE"], points["TE"]/team_points*100)
      printf("%s Points: %.2f (%.2f%% of team's total)\n", "K ", points["K "], points["K "]/team_points*100)
      printf("%s Points: %.2f (%.2f%% of team's total)\n", "DEF", points["DEF"], points["DEF"]/team_points*100)
      print ""
      
}