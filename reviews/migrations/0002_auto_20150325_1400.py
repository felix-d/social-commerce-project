# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReviewRating',
            fields=[
                ('reviewing', models.OneToOneField(to='reviews.Reviewing', serialize=False, primary_key=True)),
                ('rating', models.IntegerField(default=0)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='reviewrecommendit',
            name='reviewing',
        ),
        migrations.DeleteModel(
            name='ReviewRecommendIt',
        ),
    ]
