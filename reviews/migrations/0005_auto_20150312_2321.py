# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reviews', '0004_auto_20150302_1636'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReviewBoolAnswer',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('boolean_value', models.BooleanField(default=None)),
                ('review_element', models.ForeignKey(to='reviews.ReviewElement')),
                ('reviewing', models.ForeignKey(to='reviews.Reviewing')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ReviewComment',
            fields=[
                ('id', models.AutoField(primary_key=True, verbose_name='ID', serialize=False, auto_created=True)),
                ('text_value', models.TextField()),
                ('reviewing', models.ForeignKey(to='reviews.Reviewing')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='reviewanswer',
            name='review',
        ),
        migrations.RemoveField(
            model_name='reviewanswer',
            name='review_element',
        ),
        migrations.DeleteModel(
            name='ReviewAnswer',
        ),
    ]
