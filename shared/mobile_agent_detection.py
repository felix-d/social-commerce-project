from django.shortcuts import render
from user_agents import parse


def no_mobile(func):
    def decorator(request):
        if 'HTTP_USER_AGENT' in request.META:
            user_agent = parse(request.META['HTTP_USER_AGENT'])
            print(user_agent.is_mobile)
            if user_agent.is_mobile or user_agent.is_tablet:
                return render(request, "mobile_detected.djhtml")
            else:
                return func(request)
        else:
            return func(request)
    return decorator
