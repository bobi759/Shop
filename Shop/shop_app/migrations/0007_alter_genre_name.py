# Generated by Django 4.2.19 on 2025-04-11 09:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop_app', '0006_alter_cartitem_cart_alter_cartitem_product'),
    ]

    operations = [
        migrations.AlterField(
            model_name='genre',
            name='name',
            field=models.CharField(max_length=30),
        ),
    ]
