# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '0008_auto_20151211_0019'),
    ]

    operations = [
        migrations.CreateModel(
            name='ControlGroup',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Tab',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('tab', models.CharField(max_length=4, choices=[('f', 'Friends'), ('fof', 'Friends of friends'), ('fmmf', 'Friends with most mutual friends'), ('fmml', 'Friends with most mutual likes')])),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='controlgroup',
            name='tabs',
            field=models.ManyToManyField(to='users.Tab'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='controlgroup',
            name='users',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
    ]
