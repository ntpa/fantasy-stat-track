#!/bin/bash
## Run the node application and clean up files beforehand ## 


# Implementation only for my system. As of now

DIR_LOG="$PWD/log"
if [ ! -d "$PWD/log" ]; then # Create log directory and files if not already present
  mkdir $DIR_LOG
  touch "$DIR_LOG/output.txt"
  touch "$DIR_LOG/error.txt"
  touch "$DIR_LOG/debug.txt"
else 
  touch "$DIR_LOG/output.txt"
  touch "$DIR_LOG/error.txt"
  touch "$DIR_LOG/debug.txt"
fi

outputFile="$DIR_LOG/output.txt"
errorFile="$DIR_LOG/error.txt"
debugFile="$DIR_LOG/debug.txt"

# Empty logginng files prior to execution 
echo ' ' > "$outputFile" > "$errorFile"


node app.js > "$debugFile"
