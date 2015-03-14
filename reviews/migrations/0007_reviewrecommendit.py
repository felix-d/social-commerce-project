# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0006_auto_20150312_2353'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReviewRecommendIt',
            fields=[
                ('reviewing', models.OneToOneField(primary_key=True, to='reviews.Reviewing', serialize=False)),
                ('boolean_value', models.BooleanField(default=None)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
