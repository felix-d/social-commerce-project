from django.shortcuts import render, redirect

from phases.models import Phase
from shared.mobile_agent_detection import no_mobile
from shared.custom_user_flow import redirect_user_to_current_step


@no_mobile
def init(request):
    current_phase = Phase.objects.all().first().phase
    if not request.user.is_superuser and\
       request.user.is_authenticated():
        return redirect_user_to_current_step(request.user)
    else:
        context = dict(current_phase=current_phase)
        return render(request, "home.djhtml", context)


def login_success(request):
    current_phase = Phase.objects.all().first().phase
    print('Current phase is {}.'.format(current_phase))
    if current_phase == 1:
        print('Redirecting user {} to phase 1'.format(request.user))
        return redirect('/phase1/')
    elif current_phase == 2:
        print('Redirecting user {} to phase 2.'.format(request.user))
        return redirect('/phase2/')
