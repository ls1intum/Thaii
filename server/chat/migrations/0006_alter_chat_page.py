# Generated by Django 5.0.4 on 2024-05-14 13:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0005_alter_chat_page'),
        ('pages', '0005_alter_page_tags'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='page',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chats', to='pages.page'),
        ),
    ]
