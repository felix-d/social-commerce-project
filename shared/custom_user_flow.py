from django.shortcuts import redirect
import re


class AllauthOverrideMiddleware():
    """
    A middleware to implement a custom user flow
    """
    def __init__(self):
        # allauth urls
        self.url_social = re.compile("^/accounts/.*$")
        self.login_error = re.compile("^/accounts/social/login/error/$")

    def process_request(self, request):

        # AND CAN ONLY POST TO ALLAUTH URLS
        if request.method == "GET" and\
           self.url_social.match(request.path):
            if self.login_error.match(request.path):
                return redirect("/?cancel")
            # here we will call custom_redirect
            return redirect("/")
