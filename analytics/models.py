from django.db import models
from users.models import User


class Analytics(models.Model):
    user = models.ForeignKey(User)
    path = models.URLField()
    data = models.TextField()
    hook = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
