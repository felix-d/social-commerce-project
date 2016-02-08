# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0010_auto_20160207_1025'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tab',
            name='tab',
            field=models.CharField(choices=[('f', 'Friends'), ('fof', 'Friends of friends'), ('fmmf', 'Friends with most mutual friends'), ('fmml', 'Friends with most mutual likes')], max_length=4, unique=True),
            preserve_default=True,
        ),
    ]
