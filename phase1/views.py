from django.shortcuts import render

# Create your views here.
def step1(request):
    context_dict = {}
    return render(request, 'phase1/step1.html', context_dict)
    

