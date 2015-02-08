from django.db import models
from django.dispatch import receiver
from allauth.account.signals import user_signed_up
from django.contrib.auth.models import User

@receiver (user_signed_up)
def complete_social_signup(sender, **kwargs):
    """We start step to 0"""
    user = kwargs.pop('user')
    us = UserStep(user=user)
    us.save()
    return


class UserStep(models.Model):
    """This model holds the user step count"""
    user = models.OneToOneField(User)
    step = models.IntegerField(default=0)


class Friendship(models.Model):
    """Many to many cyclic relationship"""
    #id of the user
    user = models.ForeignKey(User, related_name="the_user")
    #id of its friend
    friend = models.ForeignKey(User, related_name="the_friend")
