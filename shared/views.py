from django.shortcuts import render, redirect

from phases.models import Phase
from shared.mobile_agent_detection import no_mobile
from shared.custom_user_flow import redirect_user_to_current_step


@no_mobile
def init(request):
    if not request.user.is_superuser and\
       request.user.is_authenticated():
        return redirect_user_to_current_step(request.user)
    else:
        current_phase = Phase.objects.all().first().phase
        context = dict(current_phase=current_phase)
        return render(request, "home.djhtml", context)


def login_success(request):
    return redirect_user_to_current_step(request.user)
