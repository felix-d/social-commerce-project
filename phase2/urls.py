from django.conf.urls import patterns, url
from phase2 import views

urlpatterns = patterns(
    '',
    url(r'^$', views.main),
    url(r'^step2/$', views.step2),
    url(r'^questionnaire/$', views.questionnaire),
    url(r'^step3/$', views.step3),
    url(r'^reviewtext/$', views.get_review_text, name="get-review-text"),
    url(r'^me/$', views.get_user_info, name="get-user-info"),
    url(r'^addwish/$', views.add_to_wishlist, name="add-wish"),
    url(r'^removewish/$', views.remove_from_wishlist, name="remove-wish"),
    url(r'^get-initial-data/$', views.get_initial_data, name="get-initial-data"),
    url(r'^userpage/$', views.get_user_page, name="user-page")
)
