from django.dispatch import receiver

from allauth.account.signals import user_signed_up, user_logged_in
from allauth.socialaccount.models import SocialAccount, SocialToken

from . import facebook as fb
from .models import UserStep, UserImage


@receiver(user_signed_up)
def complete_social_signup(*args, **kwargs):
    """We start step to 1."""
    user = kwargs.pop('user')
    UserStep(user=user).save()
    UserImage(user=user).save()


@receiver(user_logged_in)
def facebook_api_requests(*args, **kwargs):
    """Requests done to Facebook everytime the user logs in."""
    # We start by getting the Facebook token
    user = kwargs.pop('user')
    social_account = SocialAccount.objects.get(user=user)
    userid = social_account.uid
    token = SocialToken.objects.get(account=social_account)

    fb.facebook_set_friendships(user, userid, token)
    fb.facebook_set_mutual_friends(user, token)
    fb.facebook_set_mutual_likes(user, token)

    # We create a userimage object if the user hasnt one already
    UserImage.objects.get_or_create(user=user)
    fb.facebook_get_save_image_url(user, userid, token)
