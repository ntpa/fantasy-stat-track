#!/bin/awk -f
#
# Filenmae: points_breakdown.awk
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
      printf("%s Points: %.2f (%.2f%% of total)\n", "QB", points["QB"], points["QB"]/team_points*100)
      printf("%s Points: %.2f (%.2f%% of total)\n", "RB", points["RB"], points["RB"]/team_points*100)
      printf("%s Points: %.2f (%.2f%% of total)\n", "WR", points["WR"], points["WR"]/team_points*100)
      printf("%s Points: %.2f (%.2f%% of total)\n", "TE", points["TE"], points["TE"]/team_points*100)
      printf("%s Points: %.2f (%.2f%% of total)\n", "K ", points["K "], points["K "]/team_points*100)
      printf("%s Points: %.2f (%.2f%% of total)\n", "DEF", points["DEF"], points["DEF"]/team_points*100)
      print ""
      
      #printf("%s Avg: %.2f\n", "QB", points["QB"]/count["QB"])
      #printf("%s Avg: %.2f\n", "RB", points["RB"]/count["RB"])
      #printf("%s Avg: %.2f\n", "WR", points["WR"]/count["WR"])
      #printf("%s Avg: %.2f\n", "TE", points["TE"]/count["TE"])
      #printf("%s Avg: %.2f\n", "K ", points["WR"]/count["K "])
      #printf("%s Avg: %.2f\n", "DEF", points["DEF"]/count["DEF"])
}
