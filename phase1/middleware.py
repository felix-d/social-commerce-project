from django.shortcuts import redirect
from users.models import UserStep
import re

class Middleware():
    """
    A middleware to override allauth user flow
    """
    def __init__(self):
        self.url_check = "/account/facebook/login/token/"
        self.allowed_pattern = re.compile("^(/|/admin/.*|/account/facebook/login/token/)$")

    def process_request(self, request, **kwargs):
        """
        The only allowed url are '/' and facebook login
        """
        if not request.user.is_authenticated() and\
                not self.allowed_pattern.match(request.path):
                return redirect('/')
        return None

    def process_response(self, request, response):
        """
        We process the response in case of failed
        facebook login.
        We redirect to home if authentication failed.
        """
        #if url is of the form /stepX, get X
        step_reg = re.compile('^/step(\d)(?:\w|/)*$')
        step = step_reg.search(request.path)

        #if user is authenticated, we check his current step
        #and relocate him if he's not at the right step
        if step and\
                str(UserStep.objects.filter(user=request.user)[0].step) !=\
                step.group(1):
            return redirect('/step'+step+'/')

        #In case of failed faceboook login
        if request.path == self.url_check and\
                not request.user.is_authenticated():
                    return redirect('/')

        #To check the step and redirect on bad step
        return response 
