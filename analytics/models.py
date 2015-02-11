from django.db import models
from users.models import User


# Create your models here.
class UserSession(models.Model):
    user = models.ForeignKey(User)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)


class PageVisit(models.Model):
    path = models.URLField()
    last_path = models.URLField()
    user = models.ForeignKey(User)
    entered_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField()
