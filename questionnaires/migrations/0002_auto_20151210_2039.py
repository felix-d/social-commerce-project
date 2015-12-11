# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('questionnaires', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='questionnaire',
            name='primary',
        ),
        migrations.AddField(
            model_name='questionnaire',
            name='phase',
            field=models.IntegerField(choices=[(1, 'Phase 1'), (2, 'Phase 2')], default=1),
            preserve_default=False,
        ),
    ]
