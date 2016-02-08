from django.db import models
from users.models import User


class Tracked(models.Model):
    user = models.ForeignKey(User)
    data = models.TextField(blank=True, null=True)
    hook = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'USER: {}, HOOK: {}, TIME: {}, DATA: {}'.format(self.user, self.hook, self.created_at, self.data)
