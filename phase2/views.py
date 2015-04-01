from django.shortcuts import render
from shared.mobile_agent_detection import no_mobile
from products.models import Tag, get_products
from reviews.models import get_reviewers, get_review_data
from shared.custom_user_flow import redirect_user_to_current_step


# Create your views here.
@no_mobile
def home(request):
    if request.user.is_authenticated() and\
       not request.user.is_superuser:
        return redirect_user_to_current_step(request.user)
    context = dict(current_phase=2)
    return render(request, "home.djhtml", context)


def main(request):
    products = get_products()
    for p in products:
        rd = dict(review=get_review_data(request.user, p['id']))
        p.update(rd)
        if p['review']:
            rev_info = get_reviewers(request.user, p['id'])
            p.update(rev_info)

    tags = Tag.objects.get_tag_names
    context = dict(tags=tags, products=products)
    return render(request, "phase2/main.djhtml", context)
