# Social Commerce Project
An experimental platform built with Django to study social influence in e-commerce
* * *
### TODO
#### ~~Creating User objects when logging in with Facebook API~~
Currently using [django-allauth](https://github.com/pennersr/django-allauth).
Adding more authentication methods would be a walk in the park
#### extend user model with step field and redirect after login depending on step count
*In progress*
#### ~~Getting the products to fill the database~~
The script tools/get_movies.py fetches from [The Movie Database Api](https://www.themoviedb.org/documentation/api) the information of 275 movies and their poster images.
The images are stored in tools/images/
The information is stored in tools/movies.csv 
The retrieved information is of the form:
`movie_title,overview,image_url,tags`
