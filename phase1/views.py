from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from users.models import UserStep


# Create your views here.
def step0(request):
    context_dict = {}
    # Disconnect user on step1
    logout(request)
    return render(request, 'phase1/step0.html', context_dict)


@login_required
def step1(request):
    context_dict = {}
    UserStep.objects.setUserStep(request.user, 0, 1)
    return render(request, 'phase1/step1.html', context_dict)
