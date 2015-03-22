from django.db import models
from products.models import Product
from django.dispatch import receiver
from allauth.account.signals import user_signed_up, user_logged_in
from django.contrib.auth.models import User
from allauth.socialaccount.models import SocialAccount, SocialToken
import requests


def is_friendship_exists(a, b):
    if Friendship.objects.filter(user=a, friend=b):
        return True
    return False


def get_number_reviews(user):
    return len(user.reviewing_set.all())


@receiver(user_logged_in)
def check_for_friends(sender, **kwargs):
    # We start by getting the token
    user = kwargs.pop('user')
    social_account = SocialAccount.objects.get(user=user)
    token = SocialToken.objects.get(account=social_account)
    userid = SocialAccount.objects.get(user=user).uid

    # We do an api call
    base_url = "https://graph.facebook.com/v2.2/"
    # Then we get his friends
    full_url = base_url + userid + "/friends?access_token=" + str(token)
    friends_using_app = requests.get(full_url).json()['data']

    for f in friends_using_app:
        friend_id = f['id']
        try:
            friend = SocialAccount.objects.get(uid=friend_id).user
            if not is_friendship_exists(user, friend):
                Friendship.objects.get_or_create(
                    user=user,
                    friend=friend
                )
        except:
            pass


# we create a user step bound to the user
# and set its value to 1
@receiver(user_signed_up)
def complete_social_signup(sender, **kwargs):
    """We start step to 1"""
    user = kwargs.pop('user')
    us = UserStep(user=user)
    us.save()


# Increment the step count depending on
# current step
def set_user_step(user, step):
    # move to model
    user.userstep.step = step
    user.userstep.save()


class UserStep(models.Model):
    """This model holds the user step count"""
    user = models.OneToOneField(User)
    step = models.IntegerField(default=1)
    # we set the custom manager
    # objects = UserStepManager()


class Friendship(models.Model):
    """Many to many cyclic relationship"""
    # id of the user
    user = models.ForeignKey(User, related_name="the_user")
    # id of its friend
    friend = models.ForeignKey(User, related_name="the_friend")

    def __str__(self):
        return """
    {} {} and {} {}
    """.format(self.user.first_name, self.user.last_name,
               self.friend.first_name, self.friend.last_name)


class Wish(models.Model):
    user = models.ForeignKey(User)
    product = models.ForeignKey(Product)
