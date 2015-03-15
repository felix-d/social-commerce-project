# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ReviewBoolAnswer',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('boolean_value', models.BooleanField(default=None)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ReviewChildGroup',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ReviewElement',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('review_child_group', models.ForeignKey(to='reviews.ReviewChildGroup')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Reviewing',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ReviewComment',
            fields=[
                ('reviewing', models.OneToOneField(primary_key=True, serialize=False, to='reviews.Reviewing')),
                ('text_value', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ReviewRecommendIt',
            fields=[
                ('reviewing', models.OneToOneField(primary_key=True, serialize=False, to='reviews.Reviewing')),
                ('boolean_value', models.BooleanField(default=None)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ReviewRootElement',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ReviewWidget',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, auto_created=True, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('primary', models.BooleanField(default=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='reviewrootelement',
            name='review_widget',
            field=models.ForeignKey(to='reviews.ReviewWidget'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='reviewing',
            name='product',
            field=models.ForeignKey(to='products.Product'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='reviewing',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='reviewchildgroup',
            name='review_root_element',
            field=models.ForeignKey(to='reviews.ReviewRootElement'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='reviewboolanswer',
            name='review_element',
            field=models.ForeignKey(to='reviews.ReviewElement'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='reviewboolanswer',
            name='reviewing',
            field=models.ForeignKey(to='reviews.Reviewing'),
            preserve_default=True,
        ),
    ]
