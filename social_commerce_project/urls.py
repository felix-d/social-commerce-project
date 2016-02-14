from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings

urlpatterns = patterns(
    '',
    url(r'^$', 'shared.views.init'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login-success/$', 'shared.views.login_success'),
    url(r'^phase1/', include('phase1.urls')),
    url(r'^phase2/', include('phase2.urls')),
    url(r'^track/', include('analytics.urls')),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^logout/$',
        'django.contrib.auth.views.logout',
        {'next_page': '/'}, name='auth_logout'),
)
