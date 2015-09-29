from django.shortcuts import render
from .models import Analytics
from django.http import HttpResponse

# Create your views here.

def endpoint(request):
    user = request.user.id
    path = request.POST.get('path')
    hook = request.POST.get('hook')
    data = request.POST.get('data')

    analytics = Analytics(
        user=user,
        path=path,
        hook=hook,
        data=data
    )

    analytics.save()
    
    return HttpResponse("success")

    



