# Filename: csv2rankings.py 
# Author: NTPA 
# Date: 11-23-2022
# Description: Use csv file from json2.csv to create rankings summary

# Purpose: Crunch date to create insights for fantasy team owners for their
#           league

import csv 
import sys


class Player:

    def __init__(self, name, position, points_total, fantasy_team):
        self.name = name
        self.position = position
        self.points_total = points_total
        self.fantasy_team = fantasy_team
    # Print for debug Purpose
    def __str__(self):
        return f'{self.name}, {self.position}, {self.points_total}, {self.fantasy_team}'

class RankingTable:
    def __init__(self):   
        self.players = []
        # Hash map for rankings?  

    def add_players(self, players):
        for i in range(len(players)):
            self.players.append(players[i])
        self.players.sort(key=lambda player: float(player.points_total), reverse=True)
    
    # Format Logistics/Prefrence
    def print_player(self, player, pos_rank, ovr_rank): # Print player object in specified format
        print(f"{pos_rank}\t{ovr_rank}\t", player.name, player.points_total, player.fantasy_team)

    # pos: "QB", "RB", "WR", "TE", "DEF", "K "
    def print_ranking(self, pos): 
        print(f"\n\t\t {pos} Rankings \n") 
        pos_rank = 0
        ovr_rank = 0
        for player in self.players:
            ovr_rank += 1
            if player.position == pos:
                pos_rank += 1
                self.print_player(player, pos_rank, ovr_rank)

    def print_rankings(self):
        self.print_ranking("QB")
        self.print_ranking("RB")
        self.print_ranking("WR")
        self.print_ranking("TE")
        self.print_ranking("DEF")
        self.print_ranking("K ")
    

if (len(sys.argv) < 2):
    print("Not enough arguments. Did you provide input csv file?")
    exit()

with open (sys.argv[1], 'r', encoding="utf-8") as csvfile: 
    player_reader = csv.reader(csvfile, delimiter=',')
    next(player_reader) # Skip header
    players = []
    for row in player_reader: # Get players from CSV
        players.append(Player(row[0], row[1], row[2], row[3]))
 

    rankings = RankingTable()
    rankings.add_players(players)
    rankings.print_rankings()
