# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('text', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='QuestionAnswer',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('text_value', models.TextField()),
                ('boolean_value', models.BooleanField(default=None)),
                ('question', models.ForeignKey(to='questionnaires.Question')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='QuestionChoice',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='QuestionGroup',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Questionnaire',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('primary', models.BooleanField(default=None)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='QuestionnaireAnswering',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='QuestionType',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='questiongroup',
            name='questionnaire',
            field=models.ForeignKey(to='questionnaires.Questionnaire'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='questionchoice',
            name='question_type',
            field=models.ForeignKey(to='questionnaires.QuestionType'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='questionanswer',
            name='questionnaire_answering',
            field=models.ForeignKey(to='questionnaires.QuestionnaireAnswering'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='question',
            name='qgroup',
            field=models.ForeignKey(to='questionnaires.QuestionGroup'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='question',
            name='qtype',
            field=models.ForeignKey(help_text='Keep blank for open answer question.', blank=True, null=True, to='questionnaires.QuestionType'),
            preserve_default=True,
        ),
    ]
