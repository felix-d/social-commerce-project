import requests

from django.conf import settings
from django.core.files.temp import NamedTemporaryFile
from django.core.files.base import File

from allauth.socialaccount.models import SocialAccount

from .models import Friendship, MutualFriends, MutualLikes


def facebook_get_save_image_file(user, userid, token):
    """Save a user profile picture in the media folder."""
    # we delete the old image
    user.userimage.image.delete(False)
    # Then we get his profile picture and write the file
    url_fetch_profile_pic = (
        settings.FACEBOOK_API_URL + userid +
        "/picture?type=large&access_token=" + str(token))
    response = requests.get(url_fetch_profile_pic)
    img_temp = NamedTemporaryFile(delete=True)
    img_temp.write(response.content)
    img_temp.flush()
    user.userimage.image.save(
        "{}.jpg".format(user.username),
        File(img_temp))


def facebook_get_save_image_url(user, userid, token):
    """Saves a user profile picture url instead of the
    picture in the media folder."""
    url_fetch_profile_pic = (
        settings.FACEBOOK_API_URL + userid +
        "/picture?redirect=false&type=large&access_token=" + str(token))
    try:
        url = requests.get(url_fetch_profile_pic).json()['data']['url']
        user.userimage.url = url
        user.userimage.save()
    except:
        pass


def facebook_set_friendships(user, userid, token):
    """Set the user friendships in the database."""
    url_fetch_friends = (settings.FACEBOOK_API_URL + userid +
                         "/friends?access_token=" + str(token))
    friends_using_app = requests.get(url_fetch_friends).json()['data']
    for f in friends_using_app:
        friend_id = f['id']
        try:
            friend = SocialAccount.objects.get(uid=friend_id).user
            # We create mirroring relationships.
            Friendship.objects.get_or_create(user=user, friend=friend)
            Friendship.objects.get_or_create(user=friend, friend=user)
        except:
            pass


def facebook_set_mutual_likes(user, token):
    """Set mutual like relationships in the db."""
    friends = Friendship.objects.filter(user=user.pk).values('friend')
    friends_sa = SocialAccount.objects.filter(user__in=friends)
    for friend_sa in friends_sa:
        url_fetch_mutual_friends = (
            settings.FACEBOOK_API_URL + str(friend_sa.uid) +
            "?fields=context.fields" +
            "%28mutual_likes%29&access_token=" + str(token))
        try:
            data = requests.get(url_fetch_mutual_friends).json()
            total_count = int(data['context']['mutual_likes']
                              ['summary']['total_count'])
            if total_count > 0:
                MutualLikes.objects.get_or_create(
                    user=user,
                    second_user=friend_sa.user,
                    mutual_likes=total_count)
        except:
            pass


def facebook_set_mutual_friends(user, token):
    """Set mutual friends relationships in the database."""

    # We first get a list of friend ids
    friends = (Friendship.objects.filter(user=user.pk)
               .values_list('friend', flat=True))
    friends_sa = SocialAccount.objects.filter(user_id__in=friends)

    # For every friend social account, we get the number of mutual friends
    # with the given user.
    for friend_sa in friends_sa:
        url_fetch_mutual_friends = (
            settings.FACEBOOK_API_URL + str(friend_sa.uid) +
            "?fields=context.fields" +
            "%28all_mutual_friends%29&access_token=" + str(token))
        try:
            data = requests.get(url_fetch_mutual_friends).json()
            total_count = int(data['context']['all_mutual_friends']
                              ['summary']['total_count'])
            MutualFriends.objects.get_or_create(
                user=user,
                second_user=friend_sa.user,
                mutual_friends=total_count)
        except:
            pass
