from django.shortcuts import redirect
import re


class Middleware():
    """
    A middleware to implement a custom user flow
    """
    def __init__(self):
        self.url_facebook = "/accounts/facebook/login/token/"
        self.allowed_pattern = re.compile("^(/|/admin/.*)$")
        self.step_reg = re.compile('^/phase1/step(\d)(?:\w|/)*$')
        self.url_admin = re.compile("^/admin/.*$")
        self.url_root = re.compile("^/$")

    def process_response(self, request, response):
        """
        We process the response in case of failed
        facebook login.
        We redirect to home if authentication failed.
        """

        """NO USER BECAUSE WE NEED TO APPEND A SLASH"""
        if not hasattr(request, 'user'):
            return response

        """URL IS ADMIN/*, FULL ACCESS GRANTED"""
        if self.url_admin.match(request.path):
            return response

        """USER IS NOT AUTHENTICATED AND SOMEWHERE RESTRICTED"""
        # If the user is anonymous and the path is allowed we return
        if request.user.is_anonymous() and\
                not self.url_root.match(request.path):
            return redirect("/")

        """USER IS AUTHENTICATED AND NO STEP IN URL OR NOT GOOD STEP"""
        # step from url
        url_step = self.step_reg.search(request.path)

        # step from user model
        user_step = str(request.user.userstep.step) if\
            hasattr(request.user, "userstep") else\
            False

        if user_step and request.user.is_authenticated() and\
                (not url_step or user_step !=
                 url_step.group(1)):
            return redirect('/phase1/step'+user_step+'/')

        """OTHERWISE"""
        return response
