# Social Commerce Project
An experimental platform built with Django to study social influence in e-commerce

## Prototype for reviewing widget with REACTjs

http://plnkr.co/edit/HIqqdeQUvPfrc7eOOvfx?p=preview

## Structure info

* `src/` contains raw source files (sass, uncompressed images etc.)
* `build/` contains source files compiled with *gulp*, including bower components
* `static/` contains source files collected by Django for production

### Reminders
**Fetching django-nested-inline from my fork**

`pip install -e git+git://github.com/felix-d/django-nested-inline.git#egg=django-nested-inline`

**Dumping db data**

`python manage.py dumpdata --indent=4 -n >! data.json`

**GULP TASKS**

`gulp browserify-watch` watch review-app bundle w/ reactify & watchify and move bundle to build/js/tmp/

`gulp compress-js` takes everything in build/js/tmp/, minifies it and output it to /build/js/

`gulp prod-styles` move css to build/css/tmp/, compile sass, minify + compress everything and output to build/css/

`gulp compress-images` compresses images in src/images/ and ouput to /build/images/

`gulp watch` browserify-watch, compile css + js and live reload chrome

* * *
### TODO
#### ~~Creating User objects when logging in with Facebook API~~
Currently using [django-allauth](https://github.com/pennersr/django-allauth).
Adding more authentication methods would be a walk in the park
#### ~~Getting the products to fill the database~~
The script [tools/get_movies.py](https://github.com/felix-d/social-commerce-project/blob/master/tools/get_movies.py) fetches from [The Movie Database Api](https://www.themoviedb.org/documentation/api) the information of 275 movies and their poster images.
The images are stored in [tools/images/](https://github.com/felix-d/social-commerce-project/tree/master/tools/images)
The information is stored in [tools/movies.csv](https://github.com/felix-d/social-commerce-project/blob/master/tools/movies.csv#L9)
#### ~~Writing a script to fill the database from the csv file~~
#### ~~Extend user model with step field~~
The user model was extended with a one to one relationship to UserStep. This is the clean and recommended way of extending the User model
according to Django docs.
#### ~~Implement a middleware to intercept http requests and redirect the user depending on his status and step count~~
#### ~~Creating products app model~~
#### ~~Creating questionnaires app model~~
#### ~~Creating reviews app models~~
#### ~~Creating users app models~~
#### ~~Creating analytics app models~~
#### ~~Updating friendships on logging~~

Now when a user logs in, a new friendship is created in the database if it doesn't exist yet

#### ~~Create a reviewing app with React + Flux for phase1~~~
#### Create questionnaire page from the questionnaire models
#### User-agent sniffing to prevent mobile users from using the app
#### Add share dialog with javascript sdk and ajax callback to update step count
#### ...
