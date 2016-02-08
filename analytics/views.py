import json
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

from .models import Tracked


def track(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body.decode('utf-8'))
            hook = data.get('hook', None)
            tracking_data = data.get('data', None)
            Tracked.objects.create(
                user=request.user,
                data=tracking_data,
                hook=hook
            )
    except:
        pass
    return HttpResponse('success')
