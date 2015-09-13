from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings


if settings.CURRENT_PHASE is 1:
    current_home = 'phase1.views.home'
else:
    current_home = 'phase2.views.home'

urlpatterns = patterns(
    '',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^admin/sync', 'users.views.sync'),
    url(r'^$', current_home),
    url(r'^phase1/', include("phase1.urls")),
    url(r'^phase2/', include("phase2.urls")),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^logout/$',
        'django.contrib.auth.views.logout',
        {'next_page': '/'}, name='auth_logout'),
)
