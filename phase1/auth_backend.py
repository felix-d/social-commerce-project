from django.contrib.auth.models import User
from djano


class TestCaseUserBackend(object):
    def authenticate(self, testcase_user=None):
        test =
        return testcase_user

    def get_user(self, user_id):
        return User.objects.get(pk=user_id)
