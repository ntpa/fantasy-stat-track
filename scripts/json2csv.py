# Filename: json2csv.py
# Author: NTPA
# Date: 10-29-2022
# Description: Simple json to csv script for Fantasy Stat Trak application.
#
# Purpose: CSV is a lightweight alternative to JSON for storage. However, if you 
#   wish to transmit/share the files over a network, JSON allows for a more 
#   standardized approach. 

import json
import csv
import sys

# Script assumes input and output file created today, please change if needed
separator = "_"

# TODO: Take input from the command line. Current implementation is minimal 
if (len(sys.argv) < 2):
    print("Not enough arguments. Did you provide input json file?")
    exit()

inputfile = sys.argv[1]
outputfile = inputfile[0:inputfile.find('_')] + separator + "output.csv"

print(f"Input File: {inputfile!s}")
print(f"Output File: {outputfile!s}")



with open(inputfile, 'r', encoding="utf-8") as f:
    myJSON = json.load(f)
    with open(outputfile, 'w', newline='') as csvfile:
        fieldnames = ['name', 'position', 'pointsTotal', 'leagueTeam']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

        writer.writeheader()
        writer.writerows(myJSON)

