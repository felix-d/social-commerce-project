# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_userimage'),
    ]

    operations = [
        migrations.AddField(
            model_name='userimage',
            name='url',
            field=models.URLField(blank=True),
            preserve_default=True,
        ),
    ]
