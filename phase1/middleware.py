from django.shortcuts import redirect
from users.models import UserStep
import re


class Middleware():
    """
    A middleware to override allauth user flow
    """
    def __init__(self):
        self.url_check = "/accounts/facebook/login/token/"
        self.allowed_pattern = re.compile("^(/|/admin/.*)$")
        self.step_reg = re.compile('^/step(\d)(?:\w|/)*$')

    def process_response(self, request, response):
        """
        We process the response in case of failed
        facebook login.
        We redirect to home if authentication failed.
        """

        # response will be ran again so don't worry here
        # CommonMiddleware has to set the trailing slash
        # The first run, user won't be there
        if not hasattr(request, 'user'):
            return response

        # If the user is not authenticated and if he's not on allowed patterns
        if not request.user.is_authenticated() and\
                not self.allowed_pattern.match(request.path):
            return redirect('/')
        # if url is of the form /stepX, get X
        step = self.step_reg.search(request.path)

        # if user is authenticated, we check his current step
        # and relocate him if he's not at the right step
        if step and\
                str(UserStep.objects.filter(user=request.user)[0].step) !=\
                step.group(1):
            print("User is authenticated but not at the right step")
            return redirect('/step'+step+'/')

        # In case of failed faceboook login
        if request.path == self.url_check and\
                not request.user.is_authenticated():
                    print("Facebook loggin failed")
                    return redirect('/')

        # To check the step and redirect on bad step
        return response
