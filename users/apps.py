import requests
from django.apps import AppConfig
from allauth.socialaccount.models import SocialAccount, SocialToken
from .models import Friendship
from django.contrib.auth import get_user_model


User = get_user_model()
base_url = "https://graph.facebook.com/v2.4/"


class MyAppConfig(AppConfig):
    name = 'social_commerce_project'
    verbose_name = 'The Social Commerce Project'

    def ready(self):
        set_facebook_data()


def set_facebook_data():
    print("setting facebook data")
    users = User.objects.all()
    for user in users:
        account = SocialAccount.objects.get(user=user)
        userid = account.uid
        token = SocialToken.objects.get(account=account)
        set_friendships(user, userid, token)
        set_mutuals(user, userid, token)


def set_friendships(user, userid, token):
    url = base_url + userid + "/friends?access_token=" + str(token)
    friends_using_app = requests.get(url).json()['data']
    for f in friends_using_app:
        friend_id = f['id']
        try:
            friend = SocialAccount.objects.get(uid=friend_id).user
            Friendship.objects.get_or_create(user=user, friend=friend)
        except:
            pass


def set_mutuals(user, url):
    pass
