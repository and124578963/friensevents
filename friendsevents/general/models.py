from django.db import models
from django.dispatch import receiver
from django.urls import reverse
# Create your models here.
from friendsevents.settings import MEDIA_ROOT


class Groups(models.Model):
    name = models.CharField(max_length=255, db_index=True, unique=True, verbose_name='Имя', help_text='Подпись под картинкой на главной странице')
    photo = models.FileField(upload_to=MEDIA_ROOT, verbose_name='Фото', help_text='Отображается в сетке главной страницы. Размер 3:2, формат .png')
    description = models.TextField(blank=True, verbose_name='Описание')
    slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name="URL", help_text='Префикс в url ссылке на страницу.')

    def get_absolute_url(self):
        return reverse('post', kwargs={'post_slug': self.slug})

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Группы'
        verbose_name_plural = 'Группы'
        ordering = ['name']



class Projects(models.Model):
    group = models.ForeignKey(Groups, on_delete=models.CASCADE, related_name='projects', verbose_name='Категория')
    name = models.CharField(max_length=255, unique=True, verbose_name='Название проекта', help_text='')
    description = models.TextField(blank=True, verbose_name='Описание')
    general_photo = models.FileField(upload_to=MEDIA_ROOT, verbose_name='Главное фото', help_text='Отображается в сетке. Размер 3:2, формат .png')
    video = models.FileField(upload_to=MEDIA_ROOT, blank=True, verbose_name='Видео', help_text='Видео 16:9 в .mp4. Не обязательно.')
    slug = models.SlugField(max_length=255, unique=True, db_index=True, verbose_name="URL", help_text='Префикс в url ссылке на страницу.')

    def get_absolute_url(self):
        grop_slug = Groups.objects.get(name=self.group)
        grop_slug = grop_slug.slug

        return reverse('post_detail', kwargs={'post_slug2': self.slug, 'post_slug1': grop_slug, })

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Проекты'
        verbose_name_plural = 'Проекты'
        ordering = ['name']


class Photos(models.Model):
    photo = models.FileField(upload_to=MEDIA_ROOT, help_text='Отображается в сетке. Размер 3:2, формат .png')
    project = models.ForeignKey(Projects, on_delete=models.CASCADE, related_name='photos')

    def __str__(self):
        return str(self.pk)

    class Meta:
        verbose_name = 'Фото'
        verbose_name_plural = 'Фото'
        ordering = ['project']



class Employee(models.Model):
    name = models.CharField(max_length=255, db_index=True, unique=True, verbose_name='Ф.И.')
    photo = models.FileField(upload_to=MEDIA_ROOT, verbose_name='Фото', help_text='Размер 4:4.5, формат .png')
    post = models.CharField(max_length=255, blank=True, verbose_name='Должность')

    def get_absolute_url(self):
        return reverse('about')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Работники'
        verbose_name_plural = 'Работники'
        ordering = ['pk']


class Services(models.Model):
    name = models.CharField(max_length=255, db_index=True, unique=True, verbose_name='Группа услуг')
    photo = models.FileField(upload_to=MEDIA_ROOT, verbose_name='Фото', help_text='Иконка услуги. Формат .png')
    description = models.TextField(blank=True, verbose_name='Описание')

    def get_absolute_url(self):
        return reverse('services')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Услуги'
        verbose_name_plural = 'Услуги'
        ordering = ['pk']

