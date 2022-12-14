# Generated by Django 4.0.5 on 2022-07-24 11:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('general', '0005_alter_employee_post'),
    ]

    operations = [
        migrations.CreateModel(
            name='Services',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=255, unique=True, verbose_name='Группа услуг')),
                ('photo', models.FileField(help_text='Иконка услуги. Формат .png', upload_to='C:\\Users\\andrey.pervushin\\PycharmProjects\\friendsEvents\\friendsevents\\media', verbose_name='Фото')),
                ('description', models.TextField(blank=True, verbose_name='Описание')),
            ],
            options={
                'verbose_name': 'Услуги',
                'verbose_name_plural': 'Услуги',
                'ordering': ['pk'],
            },
        ),
        migrations.AlterModelOptions(
            name='employee',
            options={'ordering': ['pk'], 'verbose_name': 'Работники', 'verbose_name_plural': 'Работники'},
        ),
    ]
