# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_auto_20160207_1030'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tab',
            name='tab',
            field=models.CharField(unique=True, choices=[('a', 'All'), ('f', 'Friends'), ('fof', 'Friends of friends'), ('mf', 'Most mutual friends'), ('ml', 'Most Mutual likes')], max_length=4),
            preserve_default=True,
        ),
    ]
