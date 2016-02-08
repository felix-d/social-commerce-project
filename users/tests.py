from mock import patch
from django.test import TestCase
from django.contrib.auth.models import User
from users.models import Friendship
from users.utils import get_friends, get_fof
from users.facebook import facebook_set_friendships
from allauth.socialaccount.models import SocialAccount


def create_user(username):
    return User.objects.create_user(username=username,
                                    email="test@test.com",
                                    password="test")


def create_friendship(user, friend):
    Friendship.objects.create(user=user, friend=friend)


class UsersTests(TestCase):

    def setUp(self):
        pass

    def test_get_friends_and_get_fof(self):

        self.test_user1 = create_user("test1")
        self.test_user2 = create_user("test2")
        self.test_user3 = create_user("test3")
        self.test_user4 = create_user("test4")
        self.test_user5 = create_user("test5")
        self.test_user6 = create_user("test6")
        self.test_user7 = create_user("test7")

        create_friendship(self.test_user1, self.test_user2)
        create_friendship(self.test_user1, self.test_user3)
        create_friendship(self.test_user3, self.test_user4)
        create_friendship(self.test_user3, self.test_user5)
        create_friendship(self.test_user4, self.test_user1)
        create_friendship(self.test_user4, self.test_user6)
        create_friendship(self.test_user3, self.test_user7)
        create_friendship(self.test_user7, self.test_user1)

        user1_friends = get_friends(self.test_user1)
        user1_fof = get_fof(self.test_user1)

        self.assertEqual(user1_friends, [self.test_user2.id,
                                         self.test_user3.id,
                                         self.test_user4.id,
                                         self.test_user7.id])

        self.assertEqual(user1_fof, [self.test_user5.id,
                                     self.test_user6.id])

    @patch('requests.get')
    def test_facebook_set_friendships(self, mocked):
        class Mock:
            def json(self):
                return {'data': [{'id': 1}, {'id': 2}, {'id': 3}]}

        mocked.return_value = Mock()
        user = create_user('foobar')
        user1 = create_user('foobar1')
        sa = SocialAccount.objects.create(user=user1, uid=1)
        user2 = create_user('foobar2')
        SocialAccount.objects.create(user=user2, uid=2)
        user3 = create_user('foobar3')
        SocialAccount.objects.create(user=user3, uid=3)
        facebook_set_friendships(user, '0', 'token')
        friendships = list(Friendship.objects.all().values_list(
            'friend__pk', flat=True))
        count = len(friendships)
        self.assertEqual(count, 3)
        for f in friendships:
            self.assertIn(f, friendships)
            friendships.remove(f)
