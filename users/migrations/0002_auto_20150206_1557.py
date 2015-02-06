# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='friendship',
            old_name='friend_id',
            new_name='friend',
        ),
        migrations.RenameField(
            model_name='friendship',
            old_name='user_id',
            new_name='user',
        ),
    ]
