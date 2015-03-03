# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0003_auto_20150302_1636'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reviewrootelement',
            name='order',
            field=models.SmallIntegerField(default=0),
            preserve_default=True,
        ),
    ]
