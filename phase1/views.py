from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from users.models import UserStep


def step0(request):
    context_dict = {}
    return render(request, 'phase1/step0.html', context_dict)


@login_required
def step1(request):
    context_dict = {}
    UserStep.objects.setUserStep(request.user, 0, 1)
    return render(request, 'phase1/step1.html', context_dict)


@login_required
def step2(request):
    return render(request, 'phase1/step2.html')
