from django.conf.urls import patterns, url
from phase1 import views

urlpatterns = patterns('',
        url(r'^$', views.step1, name="step1"),
        )
