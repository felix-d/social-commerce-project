from django.shortcuts import render

# Create your views here.
def step1(request):
    context_dict = {}
    return render(request, 'phase1/step1.html', context_dict)

def step2(request):
    context_dict = {}
    return render(request, 'phase1/step2.html', context_dict)
