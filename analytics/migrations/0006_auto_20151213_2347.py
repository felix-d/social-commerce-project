# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('analytics', '0005_auto_20151213_2346'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tracked',
            name='data',
            field=models.TextField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
