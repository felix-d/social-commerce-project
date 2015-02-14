# Social Commerce Project
An experimental platform built with Django to study social influence in e-commerce

## Structure info

* `src/` contains raw source files (sass, uncompressed images etc.)
* `build/` contains source files compiled with *gulp*
* `static/` contains source files collected by Django for production

### Reminders
**Fetching django-nested-inline from my fork**

`pip install -e git+git://github.com/felix-d/django-nested-inline.git#egg=django-nested-inline`

**Dumping db data**

`python manage.py dumpdata --indent=4 -n >! data.json`

**GULP TASKS**

`gulp` compiles js and css/sass sources

`gulp compile-js` compiles js

`gulp compile-styles` compiles css and sass

`gulp compress-images` compresses images

`gulp watch` watch for new scripts and styles, compile and live reload

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
Database was filled!
#### ~~Extend user model with step field~~
The user model was extended with a one to one relationship to UserStep. This is the clean and recommended way of extending the User model
according to Django docs.
#### ~~Implement a middleware to intercept http requests and redirect the user depending on his status and step count~~
#### ~~Creating products app model~~

* Product
* Tag

#### ~~Creating questionnaires app model~~

* Questionnaire
* QuestionGroup
* Question
* QuestionChoice
* QuestionnaireAnswering
* QuestionAnswer

#### ~~Creating reviews app models~~

* Reviewing
* ReviewRootElement
* ReviewChildGroup
* ReviewElement
* ReviewAnswer

#### ~~Creating users app models~~

* FriendShip
* Wish
* UserStep

#### ~~Creating analytics app models~~

* Session
* PageVisit

#### ~~Updating friendships on logging~~

Now when a user logs in, a new friendship is created in the database if it doesn't exist yet

#### Create templates for basic interactions
#### Add share dialog with javascript sdk and ajax callback to update step count
#### ...
