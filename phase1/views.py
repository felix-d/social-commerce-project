from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from users.models import UserStep
from django import forms


class AgreementForm(forms.Form):
    your_email = forms.EmailField(label="Your email", required=True)
    i_agree = forms.BooleanField(label="I agree", required=True)


def agreement(request):
    # this is just used to controll access to the agreement
    # if "agreed" in request.session or "agreed" in request.COOKIES:
    #     return HttpResponseRedirect('/phase1/login/')
    if "logout" in request.GET:
        return HttpResponseRedirect("/phase1/login/")

    if request.method == "POST":
        agreement_form = AgreementForm(request.POST)
        if agreement_form.is_valid():
            response = HttpResponseRedirect("/phase1/login/")
            request.session["agreed"] = True
            response.set_cookie("agreed", "true")
            return response

    # if its a simple get without GET['logout']
    agreement_form = AgreementForm()
    response = render(request, "phase1/agreement.djhtml",
                      {"form": agreement_form})
    if "agreed" in request.session:
        del request.session["agreed"]
    response.delete_cookie('agreed')
    return response


def login_page(request):
    # if the user hasn't agreed, we redirect him to root page
    if "agreed" not in request.session and "agreed" not in request.COOKIES:
        return HttpResponseRedirect('/')

    context_dict = {}
    return render(request, 'phase1/login_page.djhtml', context_dict)


@login_required
def step1(request):
    context_dict = {}
    UserStep.objects.setUserStep(request.user, 0, 1)
    return render(request, 'phase1/step1.djhtml', context_dict)


@login_required
def step2(request):
    return render(request, 'phase1/step2.djhtml')
