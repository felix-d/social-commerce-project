# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('analytics', '0003_auto_20151213_2123'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tracked',
            name='path',
        ),
    ]
