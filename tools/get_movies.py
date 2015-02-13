#! /usr/bin/env python
import json
import os
import csv
from urllib.request import urlopen


def main():

    # we initialize the api manager
    tmdbApi = ApiManager('http://api.themoviedb.org/3',
                         get_env_variable('TMDB_API_KEY'))

    # we get the configuration for image queries
    config = tmdbApi.getResponse('/configuration')
    image_size = config['images']['backdrop_sizes'][0]
    base_image_url = config['images']['base_url']

    # We write the csv headers
    write_to_csv(['name', 'description', 'image', 'release_date', 'popularity',
                  'tags'], "w")

    # We want 10 pages with 20 movies each
    for p_number in range(1, 16):
        p_number = str(p_number)
        print("Processing page "+p_number+"\n************************\n")
        page = tmdbApi.getResponse(
            "/discover/movie",
            sort_by="popularity.desc",
            page=p_number)
        results = page["results"]

        for r in results:
            # we need to query the api again for
            # the description and tags
            movieid = str(r['id'])
            movie = tmdbApi.getResponse("/movie/" + movieid)

            # we write to csv file
            output = []
            title = movie['original_title']
            output.append(title)
            output.append(movie['overview'])
            image = movie['poster_path']
            output.append(image)
            release_date = movie['release_date']
            output.append(release_date)
            popularity = movie['popularity']
            output.append(popularity)
            for g in movie['genres']:
                output.append(g['name'])

            if(image is not None):
                print("> Downloading the image for "+title+"...")
                # we download the image
                download_image(base_image_url+image_size+image)
                print("> Done downloading, writing to csv...\n")
                write_to_csv(output, 'a')


def write_to_csv(array, flag):
    with open("movies.csv", flag, newline='') as csvfile:
        csvwriter = csv.writer(csvfile, delimiter=',',
                               quotechar='|', quoting=csv.QUOTE_MINIMAL)
        csvwriter.writerow(array)


def get_env_variable(var_name):
    """Get the environment variable or return an exception"""
    try:
        return os.environ[var_name]
    except KeyError:
        error_msg = "Set the {} environment variable".format(var_name)
        raise error_msg


def download_image(url):
    filepath = 'images/' + os.path.basename(url)
    f = open(filepath, 'wb')
    img = urlopen(url).read()
    f.write(img)
    f.close()


class ApiManager:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.api_key = api_key

    def getResponse(self, path, **kwargs):
        fullUrl = self.base_url + path + '?' +\
            'api_key=' + self.api_key + "&"
        for key in kwargs.keys():
            fullUrl += key + "=" + kwargs[key] + "&"
        response = urlopen(fullUrl).read().decode()
        return json.loads(response)


if __name__ == "__main__":
    main()
