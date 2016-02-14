import json

from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse,\
    HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.conf import settings

from shared.mobile_agent_detection import no_mobile
from products.models import Tag, get_products, Product
from users.utils import is_wish, get_friends, get_user
from users.models import Wish
from reviews.models import Reviewing
from shared.custom_user_flow import redirect_user_to_current_step
from reviews import utils
from phases.models import Phase
from questionnaires.utils import get_questionnaire_as_dict
from users.utils import get_number_wishes, set_user_step
from analytics.models import Tracked


# Pages
# =====
# Those views are the page views.

@login_required
def main(request):
    """PAGE"""
    current_phase = Phase.objects.all().first().phase
    if (request.user.userstep.phase2_step != 1 or current_phase != 2) and\
       not request.user.is_superuser:
        return redirect_user_to_current_step(request.user)
    else:
        Tracked.objects.create(
            user=request.user,
            data={
                'userAgent': request.META.get('HTTP_USER_AGENT', None),
                'referrer': request.META.get('HTTP_REFERER', None),
            },
            hook='WISHLIST_APP_ENTERED',
        )
        return render(request, "phase2/main.djhtml")


@login_required
def step2(request):
    """PAGE -- The questionnaire."""
    current_phase = Phase.objects.all().first().phase

    # We increment the user step
    if not request.user.is_superuser and\
       get_number_wishes(request.user) >= settings.MIN_NUMBER_WISHES and\
       request.user.userstep.phase2_step == 1:
        set_user_step(request.user, step=2, phase=2)

    # We redirect if necessary
    if (request.user.userstep.phase2_step != 2 or current_phase != 2) and\
       not request.user.is_superuser:
        return redirect_user_to_current_step(request.user)

    try:
        questionnaire = get_questionnaire_as_dict(phase=2)
    except:
        raise Exception('You need to create a questionnaire for phase 2!')
    context_dict = {
        'questionnaire': questionnaire
    }
    return render(request, 'phase2/step2.djhtml', context_dict)


@login_required
def step3(request):
    """PAGE - The last page where the user is invited to share
    the experience."""
    current_phase = Phase.objects.all().first().phase
    if (request.user.userstep.phase2_step not in (3, 4) or current_phase != 2) and\
       not request.user.is_superuser:
        return redirect_user_to_current_step(request.user)
    return render(request, 'phase2/step3.djhtml')


# Endpoints
# =====
# Those views are api endpoints.

@login_required
def get_initial_data(request):
    """ENDPOINT - Returns initial data."""
    products = get_products()

    for p in products:

        # we update with review data (the user review)
        rd = dict(review=utils.get_review_data(request.user, p['id']))
        p.update(rd)

        # we update with review info (who reviewed it)
        rev_info = utils.get_reviewers(request.user, p['id'])
        if rev_info:
            p.update(rev_info)

        # we update with wishlist tag
        p['iswish'] = is_wish(request.user.pk, p['id'])

    tags = Tag.objects.get_tag_names()
    try:
        tabs = list((request.user.usercontrolgroup
                     .control_group.tabs.values_list('tab', flat=True)))
    except:
        tabs = None
    show_user_pics = True
    display_reviews_in_user_pages = True
    network_traversing = True
    display_all_reviews = True
    try:
        show_user_pics = request.user.usercontrolgroup.control_group.show_user_pictures
    except:
        pass
    try:
        display_reviews_in_user_pages = request.user.usercontrolgroup.control_group.display_reviews_in_user_pages
    except:
        pass
    try:
        network_traversing = request.user.usercontrolgroup.control_group.network_traversing
    except:
        pass
    try:
        display_all_reviews = request.user.usercontrolgroup.control_group.display_all_reviews
    except:
        pass
    response = dict(
        minwishes=settings.MIN_NUMBER_WISHES,
        displayReviewsInUserPages=display_reviews_in_user_pages,
        networkTraversing=network_traversing,
        displayAllReviews=display_all_reviews,
        showUsersPics=show_user_pics,
        tabs=tabs,
        tags=tags,
        products=products,
        review_elements=utils.get_review_tree())
    return JsonResponse(response)


@login_required
def add_to_wishlist(request):
    """ENDPOINT -- Add a product to the wishlist."""
    if request.method != 'POST':
        return HttpResponseBadRequest("Only accessible with POST")

    json_data = json.loads(request.body.decode('utf-8'))
    product_id = json_data['product']

    try:
        product = Product.objects.get(id=product_id)
    except:
        return HttpResponseBadRequest("Product doesn't exist")

    if request.user.is_authenticated():
        w = Wish(user=request.user, product=product)
        w.save()

    return HttpResponse("success")


@login_required
def remove_from_wishlist(request):
    if request.method != 'POST':
        return HttpResponseBadRequest("Only accessible with POST")

    json_data = json.loads(request.body.decode('utf-8'))
    product_id = json_data['product']

    if request.user.is_authenticated():
        try:
            Wish.objects.filter(user=request.user, product=product_id).delete()
        except:
            return HttpResponseBadRequest("Product wasn't in wishlist.")

    return HttpResponse("success")


@login_required
def get_review_text(request):
    """Get the review text for the given productid."""

    if request.method != 'POST':
        return HttpResponseBadRequest("Only accessible with POST.")

    json_data = json.loads(request.body.decode('utf-8'))

    try:
        productid = json_data['productid']
        product = Product.objects.get(id=productid)
    except:
        return HttpResponseBadRequest("The product doesn't exist.")

    try:
        userid = json_data['userid']
        user = User.objects.get(id=userid)
    except:
        return HttpResponseBadRequest("The user doesn't exist.")

    review_data = utils.get_review_data(user, product)

    if review_data is False:
        return HttpResponseBadRequest("The review doesn't exist.")

    return JsonResponse(review_data)


@login_required
def get_user_info(request):
    """We get the username and information for the current user"""
    return JsonResponse(get_user(request.user.id))


@login_required
def get_user_page(request):

    if request.method == 'POST':

        json_data = json.loads(request.body.decode('utf-8'))

        try:
            user_id = json_data['userid']
            user = User.objects.get(id=user_id)

        except:
            return HttpResponseBadRequest("The user doesn't exists.")

    elif request.method == 'GET':
        user = request.user

    try:
        products = [x['product'] for
                    x in Reviewing.objects.filter(user=user).values("product")]
        all_products = get_products()
        reviewed_products = [p for p in all_products if p['id'] in products]
        for p in reviewed_products:
            p['iswish'] = is_wish(request.user.pk, p['id'])
            p['review'] = utils.get_review_data(user.id, p['id'])
    except:
        pass

    friends = get_friends(user)
    friends_res = []
    for f in friends:
        friends_res.append(get_user(f))
    response = dict(
        user=get_user(user.id),
        friends=friends_res,
        products=reviewed_products
    )

    return JsonResponse(response)


@login_required
def questionnaire(request):
    """ENDPOINT -- The questionnaire post endpoint.

    We could have done it on the same view but it's cleaner
    that way.
    """
    if request.method == "POST":
        # If is valid
        if not request.user.is_superuser:
            set_user_step(request.user, step=3, phase=2)
        return HttpResponseRedirect('/phase2/step3/')

    return HttpResponseBadRequest("Only accesible with POST")
