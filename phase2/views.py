from django.shortcuts import render
from shared.mobile_agent_detection import no_mobile
from products.models import Tag


# Create your views here.
@no_mobile
def home(request):
    context = dict(current_phase=2)
    return render(request, "home.djhtml", context)


def main(request):
    tags = Tag.objects.get_tag_names
    context = dict(tags=tags)
    return render(request, "phase2/main.djhtml", context)
