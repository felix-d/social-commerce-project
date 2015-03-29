from django.conf.urls import patterns, url
from phase2 import views

urlpatterns = patterns(
    '',
    url(r'^$', views.main, name="main"),
)
