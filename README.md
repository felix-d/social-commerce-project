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

**GULP TASKS**

`gulp browserify-watch` watch review-app bundle w/ reactify & watchify and move bundle to build/js/tmp/

`gulp compress-js` takes everything in build/js/tmp/, minifies it and output it to /build/js/

`gulp prod-styles` move css to build/css/tmp/, compile sass, minify + compress everything and output to build/css/

`gulp compress-images` compresses images in src/images/ and ouput to /build/images/

`gulp watch` browserify-watch, compile css + js and live reload chrome

For `gulp-image-resize`, you need to install imagemagick and graphicsmagick.

OSX

```
brew install imagemagick
brew install graphicsmagick
```

Linux

```
apt-get install imagemagick
apt-get install graphicsmagick
```

