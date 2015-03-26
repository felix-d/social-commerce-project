from django.shortcuts import render
from questionnaires.models import get_primary_questionnaire_as_dict
import json
from products.models import Tag, Product
from reviews.models import create_review, get_review_tree, del_review
from users.models import set_user_step, get_number_reviews
from django.http import HttpResponseRedirect, JsonResponse, Http404
from django.contrib.auth.decorators import login_required
from .phase1_user_flow import redirect_user_to_current_step


def home(request):
    """THE AGREEMENT PAGE"""

    if request.user.is_authenticated() and\
       not request.user.is_superuser:
        return redirect_user_to_current_step(request.user)

    elif 'resetagreement' in request.GET:
        request.session.pop("agreed", None)

    elif "agreed" in request.session:
        return HttpResponseRedirect("/phase1/login/")

    return render(request, "phase1/home.djhtml")


# The reviewing page
@login_required
def step1(request):

    if not request.user.is_superuser and\
       request.user.userstep.step != 1:
        return redirect_user_to_current_step(request.user)

    # Will be set in context
    products = Product.objects.get_user_products(request.user)
    tags = Tag.objects.get_tag_names()
    review_tree = get_review_tree()
    number_reviews = get_number_reviews(request.user)

    context_dict = {
        'products': products,
        'tags': tags,
        'name': request.user.first_name,
        'review_elements': review_tree,
        'number_reviews': number_reviews
    }
    return render(request, 'phase1/step1.djhtml', context_dict)


# Called when a review is posted
@login_required
def review(request):
    if request.method == 'POST':

        json_data = json.loads(request.body.decode('utf-8'))
        product = Product.objects.get(id=json_data['productId'])

        # if there exists a review already
        del_review(request.user, product)

        # We are only deleting
        if not json_data['reviewData']:
            result = 'success'
            json_response = {'result': result}
            return JsonResponse(json_response)

        # we are editing or creating
        create_review(json_data['reviewData'], request.user, product)

        # success!
        result = 'success'
        json_response = {'result': result}
        return JsonResponse(json_response)

    # Else what are you doing here????
    raise Http404("Only accessible with POST")


# The questionnaire page
@login_required
def step2(request):
    if not request.user.is_superuser and\
      get_number_reviews(request.user) >= 3 and\
       request.user.userstep.step == 1:
        set_user_step(request.user, 2)

    if not request.user.is_superuser and\
       request.user.userstep.step != 2:
        return redirect_user_to_current_step(request.user)

    questionnaire = get_primary_questionnaire_as_dict()
    context_dict = {
        'questionnaire': questionnaire
    }
    return render(request, 'phase1/step2.djhtml', context_dict)


# Called when a questionnaire is posted
@login_required
def questionnaire(request):
    if request.method == "POST":
        # If is valid
        set_user_step(request.user, 3)
        return HttpResponseRedirect('/phase1/step3/')

    raise Http404("Only accesible with POST")


@login_required
def step3(request):

    if not request.user.is_superuser and\
       request.user.userstep.step < 3:
        return redirect_user_to_current_step(request.user)

    return render(request, 'phase1/step3.djhtml')


@login_required
def shared(request):
    if request.method == "POST":
        # If is valid===l
        set_user_step(request.user, 4)
        result = 'success'
        json_response = {'result': result}
        return JsonResponse(json_response)

    raise Http404("Only accesible with POST")
