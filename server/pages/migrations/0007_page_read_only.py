# Generated by Django 5.0.4 on 2024-05-27 08:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0006_tag_color_alter_page_tags'),
    ]

    operations = [
        migrations.AddField(
            model_name='page',
            name='read_only',
            field=models.BooleanField(default=False),
        ),
    ]
