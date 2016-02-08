# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Phase',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, serialize=False, primary_key=True)),
                ('phase', models.IntegerField(default=1, choices=[(1, 'Phase 1'), (2, 'Phase 2')])),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
