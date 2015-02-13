#!/usr/local/bin/python

import os
import sys
import csv

os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'social_commerce_project.settings')
import django
django.setup()

from products.models import Product, Tag

# Verifications
if len(sys.argv) < 2:
    print("No csv file was provided.")
    sys.exit(1)

filepath = sys.argv[1]
fileName, fileExtension = os.path.splitext(filepath)

if fileExtension != ".csv":
    print("The file provided isn't a csv file.")
    sys.exit(1)

tag_list = {}


# Populate the database
def populate():
    """Main function"""
    with open(filepath, 'r') as csvfile:
        csvreader = csv.reader(csvfile, delimiter=',', quotechar='|')
        for i, row in enumerate(csvreader):
            if i > 0:
                add_product(row[0], row[1], row[2], row[3], row[4], row[5:])


# Add a product to the database
def add_product(title, overview, img, release_date, popularity, tags):
    p = Product.objects.get_or_create(name=title,
                                      description=overview,
                                      image_path=img[1:],
                                      caracteristic_1=release_date,
                                      caracteristic_2=popularity)[0]
    for t in tags:
        if t not in tag_list:
            print("\n**** Tag " + t + " was added to the database..\n")
            tag = Tag.objects.get_or_create(name=t)[0]
            tag_list[t] = tag
        p.tags.add(tag_list[t])
    print(title + " was added to the database...")
    return p

if __name__ == '__main__':
    populate()
