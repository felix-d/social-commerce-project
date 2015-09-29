# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '0006_auto_20150920_1625'),
    ]

    operations = [
        migrations.CreateModel(
            name='MutualLikes',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('mutual_likes', models.IntegerField()),
                ('second_user', models.ForeignKey(related_name='the_second_user_mutuall', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(related_name='the_user_mutuall', to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterField(
            model_name='mutualfriends',
            name='second_user',
            field=models.ForeignKey(related_name='the_second_user_mutualf', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='mutualfriends',
            name='user',
            field=models.ForeignKey(related_name='the_user_mutualf', to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
    ]
