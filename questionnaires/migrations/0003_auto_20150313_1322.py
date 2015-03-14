# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questionnaires', '0002_auto_20150213_1124'),
    ]

    operations = [
        migrations.RenameField(
            model_name='questionchoice',
            old_name='question_choice_group',
            new_name='question_type',
        ),
    ]
