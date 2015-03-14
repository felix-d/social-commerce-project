# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0005_auto_20150312_2321'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reviewcomment',
            name='id',
        ),
        migrations.AlterField(
            model_name='reviewcomment',
            name='reviewing',
            field=models.OneToOneField(serialize=False, primary_key=True, to='reviews.Reviewing'),
            preserve_default=True,
        ),
    ]
