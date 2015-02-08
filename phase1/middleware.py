from django.shortcuts import redirect

class Middleware():
    """
    A middleware to override allauth user flow
    """
    def __init__(self):
        self.url_check = "/account/facebook/login/token/"

    def process_request(self, request, **kwargs):
        """
        The only allowed url are '/' and facebook login
        """
        if (not request.user.is_authenticated()) and\
            request.path != "/" and\
            request.path != self.url_check:
                return redirect('/')
        return None

    def process_response(self, request, response):
        """
        We process the response in case of failed
        facebook login.
        We redirect to home if authentication failed.
        """
        if request.path == self.url_check and\
                not request.user.is_authenticated():
                    return redirect('/')
        return response 
