# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questionnaires', '0002_auto_20150211_0149'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questionanswer',
            name='boolean_value',
            field=models.BooleanField(default=None),
            preserve_default=True,
        ),
    ]
