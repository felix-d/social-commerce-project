# Social Commerce Project
An experimental platform built with Django to study social influence in e-commerce
* * *
### TODO
#### ~~Creating User objects when logging in with Facebook API~~
Currently using [django-allauth](https://github.com/pennersr/django-allauth).
Adding more authentication methods would be a walk in the park
#### ~~Getting the products to fill the database~~
The script [tools/get_movies.py](https://github.com/felix-d/social-commerce-project/blob/master/tools/get_movies.py) fetches from [The Movie Database Api](https://www.themoviedb.org/documentation/api) the information of 275 movies and their poster images.
The images are stored in [tools/images/](https://github.com/felix-d/social-commerce-project/tree/master/tools/images)
The information is stored in [tools/movies.csv](https://github.com/felix-d/social-commerce-project/blob/master/tools/movies.csv#L9) 
#### Writing a script to fill the database from the csv file
#### ~~Extend user model with step field to allow redirect after login depending on step count~~
#### Add share dialog with javascript sdk and ajax callback to update step count
#### ...
