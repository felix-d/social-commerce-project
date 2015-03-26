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

    def user_cant_access_login_if_didnt_agree(self):
        response = self.c.get('/phase1/login/')
        self.assertEqual(response.status_code, 302)

    def user_can_access_login_if_agreed(self):
        session = self.client.session
        session['agreed'] = True
        session.save()
        response = self.c.get('/phase1/login/')
        self.assertEqual(response.status_code, 200)
        
    def user_step_is_one_after_signup(self):
        self.c.login(username="test", password="test")
        userstep = User.objects.filter(username="test")[0].userstep
        self.assertEqual(1, userstep)

    def test_we_can_access_home_if_logout(self):
        response = self.c.get('/')
        self.assertEqual(response.status_code, 200)

    def test_we_can_access_admin_if_logout(self):
        response = self.c.get('/admin/')
        self.assertEqual(response.status_code, 302)

    def test_we_cant_access_steps_if_logout(self):
        response = self.c.get('/phase1/step1/')
        self.assertEqual(response.status_code, 302)
        response = self.c.get('/phase1/step2/')
        self.assertEqual(response.status_code, 302)
        response = self.c.get('/phase1/step2/')
        self.assertEqual(response.status_code, 302)

    def test_we_can_access_step1_if_login(self):
        self.c.login(username="test", password="test")
        response = self.c.get('/phase1/step1/')
        self.assertEqual(response.status_code, 200)

    def test_we_cant_access_step2_from_step1_without_condition_if_login(self):
        self.c.login(username="test", password="test")
        response = self.c.get('/phase1/step2/')
        self.assertEqual(response.status_code, 302)

    def test_we_get_redirected_to_step_if_going_to_root_if_login(self):
        self.c.login(username="test", password="test")
        response = self.c.get('/')
        self.assertEqual(response.status_code, 302)
