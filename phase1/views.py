from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.signals import request_started
from django.dispatch import receiver
from django.contrib.auth import logout
from django.contrib.auth.models import User
from users.models import UserStep
# Create your views here.
def step0(request):
    context_dict = {}
    #Disconnect user on step1
    logout(request)
    return render(request, 'phase1/step0.html', context_dict)

@login_required
def step1(request):
    context_dict = {}

    #move to model
    current_user = User.objects.find(request.user)
    current_user_step = UserStep.objects.find(user=current_user)
    if current_user_step.step == 0: current_user_step.step = 1

    return render(request, 'phase1/step1.html', context_dict)

