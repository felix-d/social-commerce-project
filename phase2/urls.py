from django.conf.urls import patterns, url
from phase2 import views

urlpatterns = patterns(
    '',
    url(r'^$', views.main, name="main"),
    url(r'^reviewtext/$', views.get_review_text, name="get-review-text"),
    url(r'^me/$', views.get_user_info, name="get-user-info"),
    url(r'^addwish/$', views.add_to_wishlist, name="add-wish"),
    url(r'^removewish/$', views.remove_from_wishlist, name="remove-wish"),
)
