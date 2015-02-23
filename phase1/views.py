from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from users.models import UserStep
from django import forms
from .phase1_user_flow import redirect_user_to_current_step


class AgreementForm(forms.Form):
    i_agree = forms.BooleanField(label="I agree", required=True)


def agreement(request):
    """THE AGREEMENT PAGE"""

    if request.user.is_authenticated() and\
       not request.user.is_superuser:
        return redirect_user_to_current_step(request.user)

    elif 'resetagreement' in request.GET:
        request.session.pop("agreed", None)

    elif "agreed" in request.session:
        return HttpResponseRedirect("/phase1/login/")

    # this is just used to controll access to the agreement
    if request.method == "POST":

        agreement_form = AgreementForm(request.POST)

        if agreement_form.is_valid():
            response = HttpResponseRedirect("/phase1/login/")
            request.session["agreed"] = True
            return response

    agreement_form = AgreementForm()
    response = render(request, "phase1/agreement.djhtml",
                      {"form": agreement_form})

    return response


def login_page(request):
    """THE LOGIN PAGE"""

    if request.user.is_authenticated() and\
       not request.user.is_superuser:
        return redirect_user_to_current_step(request.user)

    # we cant access login page without first agreeing
    if "agreed" not in request.session:
        return HttpResponseRedirect('/')

    # we get the email from the session or cookie
    context_dict = {}

    return render(request, 'phase1/login_page.djhtml', context_dict)


@login_required
def step1(request):

    if request.user.userstep.step != 1:
        return redirect_user_to_current_step(request.user)

    context_dict = {}
    UserStep.objects.setUserStep(request.user, 0, 1)
    return render(request, 'phase1/step1.djhtml', context_dict)


@login_required
def step2(request):

    if request.user.userstep.step != 2:
        return redirect_user_to_current_step(request.user)

    UserStep.objects.setUserStep(request.user, 1, 2)
    return render(request, 'phase1/step2.djhtml')


@login_required
def step3(request):

    if request.user.userstep.step != 3:
        return redirect_user_to_current_step(request.user)

    return render(request, 'phase1/step3.djhtml')
