from django.conf.urls import patterns, url
from .views import track

urlpatterns = patterns(
    '',
    url(r'^$', track, name="track"),
)
