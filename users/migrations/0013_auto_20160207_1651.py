# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0012_auto_20160207_1035'),
    ]

    operations = [
        migrations.AddField(
            model_name='controlgroup',
            name='display_all_reviews_in_widget',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='controlgroup',
            name='display_reviews_in_user_pages',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='controlgroup',
            name='network_traversing',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='controlgroup',
            name='show_user_pictures',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
    ]
