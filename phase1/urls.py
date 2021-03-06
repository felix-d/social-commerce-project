from django.conf.urls import patterns, url
from phase1 import views

urlpatterns = patterns(
    '',
    url(r'^$', views.step1, name="step1"),
    url(r'^step2/$', views.step2, name="step2"),
    url(r'^step3/$', views.step3, name="step3"),
    url(r'^review/$', views.review, name="review"),
    url(r'^get-initial-data/$', views.get_initial_data, name="get-initial-data"),
    url(r'^questionnaire/$', views.questionnaire, name="questionnaire"),
    url(r'^shared/$', views.shared, name="shared"),
)
