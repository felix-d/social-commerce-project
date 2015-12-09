from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponse
import json
from shared.mobile_agent_detection import no_mobile
from products.models import Tag, get_products, Product
from users.utils import is_wish, get_friends, get_user
from reviews.models import get_reviewers, get_review_data, get_review_tree, Reviewing
from shared.custom_user_flow import redirect_user_to_current_step
from django.contrib.auth.models import User


# Create your views here.
@no_mobile
def home(request):
    if request.user.is_authenticated() and\
       not request.user.is_superuser:
        return redirect_user_to_current_step(request.user)
    context = dict(current_phase=2)
    return render(request, "home.djhtml", context)


def add_to_wishlist(request):
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


def get_review_text(request):
    """ 
    Get the review text for the given productid
    """

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

    review_data = get_review_data(user, product)

    if not review_data:
        return HttpResponseBadRequest("The review doesn't exist.")

    return JsonResponse(review_data)


def get_user_info(request):
    """
    We get the username and information for the current user
    """
    return JsonResponse(get_user(request.user.id))


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
            p['review'] = get_review_data(user.id, p['id'])

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


def main(request):

    products = get_products()

    for p in products:

        # we update with review data (the user review)
        rd = dict(review=get_review_data(request.user, p['id']))
        p.update(rd)

        # we update with review info (who reviewed it)
        rev_info = get_reviewers(request.user, p['id'])
        if rev_info:
            p.update(rev_info)

        # we update with wishlist tag
        p['iswish'] = is_wish(request.user, p['id'])
        
    tags = Tag.objects.get_tag_names
    context = dict(tags=tags,
                   products=json.dumps(products),
                   review_elements=get_review_tree())

    return render(request, "phase2/main.djhtml", context)
