from django.test import TestCase
from django.contrib.auth.models import User
from users.models import UserStep
from django.test import Client


class MyTests(TestCase):
    fixtures = ['data.json']

    def setUp(self):
        self.test_user = User.objects.create_user(username="test2",
                                                  email="test2@test2.ca",
                                                  password="test2")
        us = UserStep(user=self.test_user)
        us.save()
        self.c = Client()

    def test_we_can_access_home(self):
        response = self.c.get('/')
        self.assertEqual(response.status_code, 200)

    def test_we_can_access_admin(self):
        response = self.c.get('/admin/', follow=True)
        self.assertEqual(response.status_code, 200)

    def test_we_cant_access_step1(self):
        response = self.c.get('/phase1/step1/')
        self.assertEqual(response.status_code, 302)

    def test_we_can_login(self):
        assert(self.c.login(username="test2", password="test2"))

        def test_we_can_access_step1(self):
            response = self.c.get('/phase1/step1/', follow=True)
            self.assertEqual(response.status_code, 200)

        def test_step_is_incremented(self):
            current_user_step = self.test_user.userstep.step
            self.assertEqual(current_user_step, 1)
