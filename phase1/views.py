import json

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django import http

from questionnaires.utils import get_questionnaire_as_dict
from products.models import Tag, Product, get_products
from reviews.models import create_review, get_review_tree,\
    get_review_data, del_review
from users.utils import set_user_step, get_number_reviews
from shared.custom_user_flow import redirect_user_to_current_step
from shared.mobile_agent_detection import no_mobile


# Pages
# =====
# Those views are the page views.

@no_mobile
def home(request):
    """PAGE -- The agreement page."""

    if request.user.is_authenticated() and\
       not request.user.is_superuser:
        return redirect_user_to_current_step(request.user)

    context = dict(current_phase=1)
    return render(request, "home.djhtml", context)


@login_required
def step1(request):
    """PAGE -- The main phase 1 reviewing page that loads
    the React app."""
    if not request.user.is_superuser and\
       request.user.userstep.phase1_step != 1:
        return redirect_user_to_current_step(request.user)

    products = get_products()
    # We add the review data for each product
    for p in products:
        rd = dict(review=get_review_data(request.user, p['id']))
        p.update(rd)
    tags = Tag.objects.get_tag_names()
    review_tree = get_review_tree()
    number_reviews = get_number_reviews(request.user)

    context_dict = {
        'products': json.dumps(products),
        'tags': tags,
        'name': request.user.first_name,
        'review_elements': review_tree,
        'number_reviews': number_reviews
    }
    return render(request, 'phase1/step1.djhtml', context_dict)


@login_required
def step2(request):
    """PAGE -- The questionnaire."""
    if not request.user.is_superuser and\
       get_number_reviews(request.user) >= 3 and\
       request.user.userstep.phase1_step == 1:
        set_user_step(request.user, step=2, phase=1)

    if not request.user.is_superuser and\
       request.user.userstep.phase1_step != 2:
        return redirect_user_to_current_step(request.user)

    questionnaire = get_questionnaire_as_dict(phase=1)
    context_dict = {
        'questionnaire': questionnaire
    }
    return render(request, 'phase1/step2.djhtml', context_dict)


@login_required
def step3(request):
    """PAGE - The last page where the user is invited to share
    the experience."""
    if not request.user.is_superuser and\
       request.user.userstep.phase1_step < 3:
        return redirect_user_to_current_step(request.user)
    return render(request, 'phase1/step3.djhtml')


# Endpoints
# =====
# Those views are api endpoints.

@login_required
def get_initial_data(request):
    """ENDPOINT -- Get initial data."""
    products = get_products()

    # We add the review data for each product
    for p in products:
        rd = dict(review=get_review_data(request.user, p['id']))
        p.update(rd)
    tags = Tag.objects.get_tag_names()
    review_tree = get_review_tree()
    number_reviews = get_number_reviews(request.user)

    data = {
        'products': products,
        'tags': tags,
        'name': request.user.first_name,
        'reviewElements': review_tree,
        'numberReviews': number_reviews
    }
    return http.JsonResponse(data)


@login_required
def review(request):
    """ENDPOINT -- Called when a review is posted."""
    if request.method != 'POST':
        return http.HttpResponseBadRequest("Only accessible with POST.")

    json_data = json.loads(request.body.decode('utf-8'))
    product = Product.objects.get(id=json_data['productId'])

    # if there exists a review already
    del_review(request.user, product)

    # We are only deleting
    if not json_data['reviewData']:
        result = 'success'
        json_response = {'result': result}
        return http.JsonResponse(json_response)

    # we are editing or creating
    create_review(json_data['reviewData'], request.user, product)

    # success!
    result = 'success'
    json_response = {'result': result}
    return http.JsonResponse(json_response)


@login_required
def questionnaire(request):
    """ENDPOINT -- The questionnaire post endpoint.

    We could have done it on the same view but it's cleaner
    that way.
    """
    if request.method == "POST":
        # If is valid
        if not request.user.is_superuser:
            set_user_step(request.user, step=3, phase=1)
        return http.HttpResponseRedirect('/phase1/step3/')

    return http.HttpResponseBadRequest("Only accesible with POST")


@login_required
def shared(request):
    """ENDPOINT -- We validate if the experience was shared."""
    if request.method == "POST":
        # If is valid===l
        set_user_step(request.user, step=4, phase=1)
        result = 'success'
        json_response = {'result': result}
        return http.JsonResponse(json_response)

    return http.HttpResponseBadRequest("Only accesible with POST")
