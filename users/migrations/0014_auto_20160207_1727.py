# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0013_auto_20160207_1651'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='controlgroup',
            name='display_all_reviews_in_widget',
        ),
        migrations.AddField(
            model_name='controlgroup',
            name='display_all_reviews',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
    ]
