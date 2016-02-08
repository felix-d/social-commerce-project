# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('analytics', '0004_remove_tracked_path'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tracked',
            name='data',
            field=models.TextField(blank=True),
            preserve_default=True,
        ),
    ]
