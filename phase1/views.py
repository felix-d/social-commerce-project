from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from users.models import UserStep
from django import forms


class AgreementForm(forms.Form):
    email = forms.EmailField(label="Your email", required=True)
    i_agree = forms.BooleanField(label="I agree", required=True)


def agreement(request):
    """This view controls the agreement form and related user flow"""
    # this is just used to controll access to the agreement
    if request.method == "POST":

        agreement_form = AgreementForm(request.POST)

        if agreement_form.is_valid():

            response = HttpResponseRedirect("/phase1/login/")

            # we set the session and a cookie for data persistance
            request.session["agreed"] = request.POST['email']
            response.set_cookie("agreed", request.POST['email'])

            return response

    # if agreed is set in session or in cookie, we can jump straight to login
    # but newuser cant be set cause that mean we want the user to agree again
    if ("agreed" in request.session or
       "agreed" in request.COOKIES) and "newuser" not in request.GET:
        return HttpResponseRedirect("/phase1/login/")

    agreement_form = AgreementForm()
    response = render(request, "phase1/agreement.djhtml",
                      {"form": agreement_form})

    # because new user might be set, we delete agreed from cookie and email
    response.delete_cookie("agreed")
    if 'agreed' in request.session:
        del request.session['agreed']

    return response


def login_page(request):
    """This view controls the login page"""

    # we cant access login page without first agreeing
    if "agreed" not in request.session and "agreed" not in request.COOKIES:
        return HttpResponseRedirect('/')

    # we get the email from the session or cookie
    email = request.session.get('agreed', request.COOKIES.get("agreed", ""))
    context_dict = {'email': email}

    return render(request, 'phase1/login_page.djhtml', context_dict)


@login_required
def step1(request):
    context_dict = {}
    UserStep.objects.setUserStep(request.user, 0, 1)
    return render(request, 'phase1/step1.djhtml', context_dict)


@login_required
def step2(request):
    return render(request, 'phase1/step2.djhtml')
