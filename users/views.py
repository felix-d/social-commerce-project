from django.contrib import messages
from django.http import HttpResponseRedirect
from .utils import set_facebook_data


# Create your views here.
def sync(request):
    set_facebook_data()
    messages.success(request, "Facebook data synchronization successful.")
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
