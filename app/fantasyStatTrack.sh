#!/bin/bash
## Run the node application and clean up files beforehand ## 


# Implementation only for my system. As of now
# TODO: Implement logic when the below directory and file not created
outputFile="$PWD/log/output.txt"
errorFile="$PWD/log/error.txt"
debugFile="$PWD/log/debug.txt"

# Empty logginng files prior to execution 
echo ' ' > "$outputFile"
echo ' ' > "$errorFile"


node app.js > "$debugFile"
