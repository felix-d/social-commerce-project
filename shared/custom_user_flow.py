from django.shortcuts import redirect
from django.conf import settings
import re
from phases.models import Phase


def redirect_user_to_current_step(user):
    current_phase = Phase.objects.all().first().phase
    user_step = getattr(user.userstep,
                        'phase{}_step'.format(current_phase))
    # Specific to phase1
    if current_phase is 1:
        # because 4 is to indicate sharing happened,
        # we still redirect on 3
        user_step = 3 if user_step is 4 else user_step

    # Specific to phase2
    if current_phase is 2:
        pass

    # Both phases
    if user_step is 1:
            url = "/phase{}/".format(str(current_phase))

    else:
            url = "/phase{}/step{}/".format(str(current_phase),
                                            user_step)
    return redirect(url)


class AllauthOverrideMiddleware():
    """A middleware to implement a custom user flow.

    This middleware ensures we don't use django allauth urls
    by redirecting to the home page if an error occurs.
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
