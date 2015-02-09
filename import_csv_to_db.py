#!usr/local/bin/python

import os
import sys
import csv

filepath = sys.argv[0]

if not filepath :
    print("No csv file was provided.")
    sys.exit(1)

fileName, fileExtension = os.path.splitext(filepath)

if fileExtension != ".csv" :
    print("The file provided isn't a csv file.")
    sys.exit(1)

file = os.read(filepath)

