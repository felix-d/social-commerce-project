# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '0004_userimage_url'),
    ]

    operations = [
        migrations.CreateModel(
            name='MutualFriends',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('mutual_friends', models.IntegerField()),
                ('second_user', models.ForeignKey(to=settings.AUTH_USER_MODEL, related_name='the_ssecond_user')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, related_name='the_fuser')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
