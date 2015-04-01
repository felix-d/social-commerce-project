from django.test import TestCase
from django.contrib.auth.models import User
from users.models import UserStep
from django.test import Client


# Create your tests here.
class Phase2Tests(TestCase):
    fixtures = ['data.json']

    def setUp(self):
        self.test_user = User.objects.create_user(username="test",
                                                  email="test@test.com",
                                                  password="test")
        us = UserStep(user=self.test_user1)
        us.save()
        self.c = Client()
