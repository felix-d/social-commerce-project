from django.shortcuts import redirect
from django.http import Http404
import re


class AllauthOverrideMiddleware():
    """
    A middleware to implement a custom user flow
    """
    def __init__(self):
        # allauth urls
        self.url_social = re.compile("^/accounts/.*$")

    def process_request(self, request):

        # AND CAN ONLY POST TO ALLAUTH URLS
        if request.method == "GET" and\
           self.url_social.match(request.path):
            # here we will call custom_redirect
            raise Http404("Allauth urls are not accessible with GET.")

    def process_response(self, request, response):
        # All 404 are redirected
        if response.status_code == 404:
            # here we will call custom_redirect
            return redirect("/")
        return response
