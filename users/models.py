import functools
from django.db import models
from django.dispatch import receiver
from allauth.account.signals import user_signed_up, user_logged_in
from django.contrib.auth.models import User
from allauth.socialaccount.models import SocialAccount, SocialToken
import requests
from django.core.files.base import File
from django.core.files.temp import NamedTemporaryFile


def get_number_reviews(user):
    return len(user.reviewing_set.all())


# return an array of friend ids for the current user
@functools.lru_cache()
def get_friends(user):
    return [f['friend']
            for f in
            Friendship.objects.filter(user=user)
            .values('friend')]


# return an array of fof ids for the current user
@functools.lru_cache()
def get_fof(user):
    friends_ids = get_friends(user)
    fofs = []
    for fid in friends_ids:
        friends_of_friend = get_friends(fid)
        for f in friends_of_friend:
            if f is not user.id and f not in friends_ids:
                fofs.append(f)

    return fofs


# return an array of ids of user having mutual friends with user
@functools.lru_cache()
def get_users_share_mutual_friends(user):
    mutual_friends = MutualFriends.objects.filter(user=user)
    mutual_friends = [mf.second_user.id for mf in mutual_friends]
    print(mutual_friends)
    return mutual_friends


# return an array of ids of user having mutual likes with user
@functools.lru_cache()
def get_users_share_mutual_likes(user):
    mutual_likes = MutualLikes.objects.filter(user=user)
    mutual_likes = [ml.second_user.id for ml in mutual_likes]
    return mutual_likes


def get_user(user):
    try:
        u = User.objects.get(id=user)
    except:
        pass
    try:
        url = u.userimage.url
    except:
        url = ""
    return dict(id=u.id, username=u.username, pic=url)

    
@receiver(user_logged_in)
def facebook_api_requests(sender, **kwargs):
    # We start by getting the token
    user = kwargs.pop('user')
    social_account = SocialAccount.objects.get(user=user)
    userid = social_account.uid
    token = SocialToken.objects.get(account=social_account)

    # We do an api call
    base_url = "https://graph.facebook.com/v2.4/"

    facebook_set_friendships(user, base_url, userid, token)
    facebook_set_mutual_friends(user, base_url, token)
    facebook_set_mutual_likes(user, base_url, token)

    # We create a userimage object if the user hasnt one already
    UserImage.objects.get_or_create(user=user)
    # facebook_get_save_image_file(user, base_url, userid, token)
    facebook_get_save_image_url(user, base_url, userid, token)


def facebook_set_friendships(user, base_url, userid, token):
    """We set user friendships"""
    url_fetch_friends = base_url + userid + "/friends?access_token=" + str(token)
    friends_using_app = requests.get(url_fetch_friends).json()['data']
    for f in friends_using_app:
        friend_id = f['id']
        try:
            friend = SocialAccount.objects.get(uid=friend_id).user
            Friendship.objects.get_or_create(
                user=user,
                friend=friend
            )
            Friendship.objects.get_or_create(
                user=friend,
                friend=user
            )
        except:
            pass


def facebook_set_mutual_friends(user, base_url, token):
    friends = Friendship.objects.filter(user=user.pk).values('friend')
    friends_sa = SocialAccount.objects.filter(user__in=friends)
    for friend_sa in friends_sa:
        url_fetch_mutual_friends = base_url + str(friend_sa.uid) +\
                                   "?fields=context.fields" +\
                                   "%28all_mutual_friends%29&access_token=" + str(token)
        try:
            data = requests.get(url_fetch_mutual_friends).json()
            total_count = int(data['context']['all_mutual_friends']['summary']['total_count'])
            MutualFriends.objects.get_or_create(user=user,
                                                second_user=friend_sa.user,
                                                mutual_friends=total_count)
        except:
            pass


def facebook_set_mutual_likes(user, base_url, token):
    friends = Friendship.objects.filter(user=user.pk).values('friend')
    friends_sa = SocialAccount.objects.filter(user__in=friends)
    for friend_sa in friends_sa:
        url_fetch_mutual_friends = base_url + str(friend_sa.uid) +\
                                   "?fields=context.fields" +\
                                   "%28mutual_likes%29&access_token=" + str(token)
        try:
            data = requests.get(url_fetch_mutual_friends).json()
            total_count = int(data['context']['mutual_likes']['summary']['total_count'])
            if total_count > 0:
                MutualLikes.objects.get_or_create(user=user,
                                                  second_user=friend_sa.user,
                                                  mutual_likes=total_count)
        except:
            pass


def facebook_get_save_image_url(user, base_url, userid, token):
    """Saves a user profile picture url instead of the picture in the media folder"""
    url_fetch_profile_pic = base_url + userid + "/picture?redirect=false&type=large&access_token=" + str(token)
    url = requests.get(url_fetch_profile_pic).json()['data']['url']
    user.userimage.url = url
    user.userimage.save()


def facebook_get_save_image_file(user, base_url, userid, token):
    """Save a user profile picture in the media folder, takes more time"""
    # we delete the old image
    user.userimage.image.delete(False)
    # Then we get his profile picture and write the file
    url_fetch_profile_pic = base_url + userid + "/picture?type=large&access_token=" + str(token)
    response = requests.get(url_fetch_profile_pic)
    img_temp = NamedTemporaryFile(delete=True)
    img_temp.write(response.content)
    img_temp.flush()
    user.userimage.image.save(
        "{}.jpg".format(user.username),
        File(img_temp)
    )


# we create a user step bound to the user
# and set its value to 1
@receiver(user_signed_up)
def complete_social_signup(sender, **kwargs):
    """We start step to 1"""
    user = kwargs.pop('user')
    UserStep(user=user).save()
    UserImage(user=user).save()


def is_wish(user, product):
    wish = Wish.objects.filter(user=user.id, product=product)
    if len(wish) is 0:
        return False
    else: 
        return True

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
        return """
    {} {} and {} {}
    """.format(self.user.first_name, self.user.last_name,
               self.friend.first_name, self.friend.last_name)


class MutualFriends(models.Model):
    user = models.ForeignKey(User, related_name="the_user_mutualf")
    second_user = models.ForeignKey(User, related_name="the_second_user_mutualf")
    mutual_friends = models.IntegerField()

    def __str__(self):
        return '{} and {} have {} mutual friends.'.format(
            self.user.username, self.second_user.username, self.mutual_friends)


class MutualLikes(models.Model):
    user = models.ForeignKey(User, related_name="the_user_mutuall")
    second_user = models.ForeignKey(User, related_name="the_second_user_mutuall")
    mutual_likes = models.IntegerField()

    def __str__(self):
        return '{} and {} have {} mutual likes.'.format(
            self.user.username, self.second_user.username, self.mutual_likes)


class Wish(models.Model):
    user = models.ForeignKey(User)
    product = models.ForeignKey('products.Product')
