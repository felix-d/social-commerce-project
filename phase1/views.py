from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.signals import request_started
from django.dispatch import receiver

# Create your views here.
def step1(request):
    context_dict = {}
    return render(request, 'phase1/step1.html', context_dict)

@login_required
def step2(request):
    context_dict = {}
    return render(request, 'phase1/step2.html', context_dict)

# @receiver(request_started)
# def check_if_logged_in(sender, **kwargs):
#     print(sender)

