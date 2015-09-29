# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_mutualfriends'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mutualfriends',
            name='second_user',
            field=models.ForeignKey(related_name='the_second_user_mutual', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='mutualfriends',
            name='user',
            field=models.ForeignKey(related_name='the_user_mutual', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
    ]
