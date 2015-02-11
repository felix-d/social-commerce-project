# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('questionnaires', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuestionAnswer',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('text_value', models.TextField()),
                ('boolean_value', models.BooleanField()),
                ('question', models.ForeignKey(to='questionnaires.Question')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='QuestionnaireAnswering',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='questionanswer',
            name='questionnaire_answering',
            field=models.ForeignKey(to='questionnaires.QuestionnaireAnswering'),
            preserve_default=True,
        ),
        migrations.RemoveField(
            model_name='questionchoice',
            name='question',
        ),
        migrations.AddField(
            model_name='question',
            name='qchoices',
            field=models.ManyToManyField(to='questionnaires.QuestionChoice'),
            preserve_default=True,
        ),
    ]
