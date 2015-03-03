# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0002_remove_reviewrootelement_has_child'),
    ]

    operations = [
        migrations.AddField(
            model_name='reviewelement',
            name='order',
            field=models.SmallIntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='reviewchildgroup',
            name='order',
            field=models.SmallIntegerField(default=0),
            preserve_default=True,
        ),
    ]
