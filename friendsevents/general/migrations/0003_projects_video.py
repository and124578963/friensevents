# Generated by Django 4.0.5 on 2022-07-17 18:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('general', '0002_groups_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='projects',
            name='video',
            field=models.FileField(blank=True, upload_to='C:\\Users\\andrey.pervushin\\PycharmProjects\\friendsEvents\\friendsevents\\media'),
        ),
    ]
