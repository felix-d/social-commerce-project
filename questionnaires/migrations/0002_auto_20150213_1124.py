# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questionnaires', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='order',
        ),
        migrations.RemoveField(
            model_name='questionchoice',
            name='order',
        ),
        migrations.RemoveField(
            model_name='questiongroup',
            name='order',
        ),
        migrations.AddField(
            model_name='questionnaire',
            name='primary',
            field=models.BooleanField(default=None),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='question',
            name='qtype',
            field=models.ForeignKey(null=True, blank=True, help_text='Keep blank for open answer question.', to='questionnaires.QuestionType'),
            preserve_default=True,
        ),
    ]
