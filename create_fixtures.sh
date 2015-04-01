#! /bin/bash

workon hec
python manage.py dumpdata --indent=4 -e contenttypes -e sessions -e admin -n >! data.json
