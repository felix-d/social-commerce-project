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

    class Meta:
        verbose_name = 'Mutual Friend'
        verbose_name_plural = 'Mutual Friends'

    def __str__(self):
        return '{} and {} have {} mutual friends.'.format(
            self.user.username, self.second_user.username, self.mutual_friends)


class MutualLikes(models.Model):
    user = models.ForeignKey(User, related_name='the_user_mutuall')
    second_user = models.ForeignKey(
        User, related_name='the_second_user_mutuall')
    mutual_likes = models.IntegerField()

    class Meta:
        verbose_name = 'Mutual Like'
        verbose_name_plural = 'Mutual Likes'

    def __str__(self):
        return '{} and {} have {} mutual likes.'.format(
            self.user.username, self.second_user.username, self.mutual_likes)


class Wish(models.Model):
    user = models.ForeignKey(User)
    product = models.ForeignKey('products.Product')

TABS = (
    ('a', 'All'),
    ('f', 'Friends'),
    ('fof', 'Friends of friends'),
    ('mf', 'Most mutual friends'),
    ('ml', 'Most Mutual likes'),
)


class Tab(models.Model):
    tab = models.CharField(max_length=4, choices=TABS, unique=True)

    def __str__(self):
        return self.tab


class ControlGroup(models.Model):
    tabs = models.ManyToManyField(Tab)
    show_user_pictures = models.BooleanField(default=True)
    display_reviews_in_user_pages = models.BooleanField(default=True)
    network_traversing = models.BooleanField(default=True)
    display_all_reviews = models.BooleanField(default=True)
    name = models.CharField(max_length=255)

    class Meta:
        verbose_name = 'Group'
        verbose_name_plural = 'Groups'

    def __str__(self):
        return self.name


class UserControlGroup(models.Model):
    user = models.OneToOneField(User)
    control_group = models.ForeignKey(ControlGroup)

    def __str__(self):
        return self.control_group.name
