from django.test import TestCase
from django.contrib.auth.models import User
from users.models import UserStep
from django.test import Client


class Phase1Tests(TestCase):
    fixtures = ['data.json']

    def setUp(self):
        self.test_user = User.objects.create_user(username="test",
                                                  email="test@test.com",
                                                  password="test")
        us = UserStep(user=self.test_user)
        us.save()
        self.c = Client()

    def test_we_can_access_home_if_logout(self):
        response = self.c.get('/')
        self.assertEqual(response.status_code, 200)

    def test_we_can_access_admin_if_logout(self):
        response = self.c.get('/admin/', follow=True)
        self.assertEqual(response.status_code, 200)

    def test_we_cant_access_steps_if_logout(self):
        response = self.c.get('/phase1/step1/')
        self.assertEqual(response.status_code, 302)
        response = self.c.get('/phase1/step2/')
        self.assertEqual(response.status_code, 302)

    def test_we_cant_access_random_string_if_logout(self):
        response = self.c.get('/fssjijijllnnfg/')
        self.assertEqual(response.status_code, 302)

    def test_we_can_access_step1_if_login(self):
        self.c.login(username="test", password="test")
        response = self.c.get('/phase1/step1/', follow=True)
        self.assertEqual(response.status_code, 200)

    def test_step_was_incremented_on_step1(self):
        self.c.login(username="test", password="test")
        self.c.get('/phase1/step1/')
        userstep = UserStep.objects.get(user=self.test_user)
        self.assertEqual(userstep.step, 1)

    def test_we_cant_access_step2_from_step1_without_condition_if_login(self):
        self.c.login(username="test", password="test")
        self.c.get('/phase1/step1/')
        response = self.c.get('/phase1/step2/')
        self.assertEqual(response.status_code, 302)

    def test_we_get_redirected_to_step_if_going_to_root_if_login(self):
        self.c.login(username="test", password="test")
        response = self.c.get('/')
        self.assertEqual(response.status_code, 302)

    def test_we_get_redirected_to_step_if_going_random_if_login(self):
        self.c.login(username="test", password="test")
        response = self.c.get('/irteroiroeiureote/')
        self.assertEqual(response.status_code, 302)
