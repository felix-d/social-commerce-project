# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_auto_20150920_1633'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userstep',
            old_name='step',
            new_name='phase1_step',
        ),
        migrations.AddField(
            model_name='userstep',
            name='phase2_step',
            field=models.IntegerField(default=1),
            preserve_default=True,
        ),
    ]
