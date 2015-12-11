from django.db import models
from django.contrib.auth.models import User


class UserStep(models.Model):
    """This model holds the user step count"""
    user = models.OneToOneField(User)
    phase1_step = models.IntegerField(default=1)
    phase2_step = models.IntegerField(default=1)


class UserImage(models.Model):
    """This model holds the user profile picture"""
    user = models.OneToOneField(User)
    image = models.ImageField(upload_to="user_pictures")
    url = models.URLField(blank=True)


class Friendship(models.Model):
    """Many to many cyclic relationship"""
    # id of the user
    user = models.ForeignKey(User, related_name="the_user")
    # id of its friend
    friend = models.ForeignKey(User, related_name="the_friend")

    def __str__(self):
        return '{} {} and {} {}'.format(
            self.user.first_name, self.user.last_name,
            self.friend.first_name, self.friend.last_name)


class MutualFriends(models.Model):
    user = models.ForeignKey(User, related_name="the_user_mutualf")
    second_user = models.ForeignKey(
        User, related_name="the_second_user_mutualf")
    mutual_friends = models.IntegerField()

    def __str__(self):
        return '{} and {} have {} mutual friends.'.format(
            self.user.username, self.second_user.username, self.mutual_friends)


class MutualLikes(models.Model):
    user = models.ForeignKey(User, related_name='the_user_mutuall')
    second_user = models.ForeignKey(
        User, related_name='the_second_user_mutuall')
    mutual_likes = models.IntegerField()

    def __str__(self):
        return '{} and {} have {} mutual likes.'.format(
            self.user.username, self.second_user.username, self.mutual_likes)


class Wish(models.Model):
    user = models.ForeignKey(User)
    product = models.ForeignKey('products.Product')
