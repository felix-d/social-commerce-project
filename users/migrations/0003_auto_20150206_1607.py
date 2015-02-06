# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20150206_1557'),
    ]

    operations = [
        migrations.RenameField(
            model_name='session',
            old_name='user_id',
            new_name='user',
        ),
    ]
