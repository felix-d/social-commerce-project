from django.shortcuts import render
from products.models import Tag, Product
from reviews.models import ReviewRootElement, ReviewChildGroup, ReviewElement
from django.http import HttpResponseRedirect
# from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from users.models import UserStep
# from reviews.models import Reviewing
# from products.models import Product
from django import forms
from .phase1_user_flow import redirect_user_to_current_step
from django.forms.utils import ErrorList


class DivErrorList(ErrorList):
    """A custom div error list for the agreement form"""
    def __str__(self):
        return self.as_divs()

    def as_divs(self):
        if not self:
            return ''
        return '<div class="errorlist">{}</div>'.format(''.join([
            '<div class="error alert alert-danger">{}</div>'
            .format(e) for e in self
        ]))


class AgreementForm(forms.Form):
    """The agreement form"""
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

        agreement_form = AgreementForm(request.POST,
                                       error_class=DivErrorList)

        if agreement_form.is_valid():
            response = HttpResponseRedirect("/phase1/login/")
            request.session["agreed"] = True
            return response

    else:
        agreement_form = AgreementForm()
    context = {"form": agreement_form}
    return render(request, "phase1/agreement.djhtml", context)


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

    # Will be set in context
    products = Product.objects.get_user_products(request)
    tags = Tag.objects.get_tag_names()

    # We build the review tree
    review_root_elements = ReviewRootElement.objects.all()

    # We create a list composed of dicts(name=X, childs=[...])
    review_tree = [dict(text=rre.name, categories=[])
                   for rre in review_root_elements]

    # For every root element
    for i, r in enumerate(review_root_elements):
        
        # Get all the review_child_groups
        review_child_groups = ReviewChildGroup.objects.filter(
            review_root_element=r)

        # And for every review_child_group
        for c in review_child_groups:

            # Create a dictionnary of the same form
            review_child_group = dict(name=c.name, elements=[])

            # Build a list of element names of that child group
            review_elements = list(map(lambda x: x.name,
                                       ReviewElement.objects.filter(
                                           review_child_group=c)))

            # Set childs to those elements
            review_child_group['elements'] = review_elements

            # Set this child group as a child of current review_root_element
            review_tree[i]['categories'].append(review_child_group)

    print(review_tree)
    context_dict = {
        'products': products,
        'tags': tags,
        'name': request.user.first_name,
        'review_elements': review_tree
    }
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
