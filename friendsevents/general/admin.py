from django.contrib import admin
from django.utils.html import format_html

from .models import *


class PhotosInstanceInline(admin.StackedInline):
    model = Photos
    extra = 0



@admin.register(Projects)
class PersonAdmin(admin.ModelAdmin):
    list_display = ( "name", "group", "description", "image_tag")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [PhotosInstanceInline]

    def image_tag(self, obj):
        return format_html('<img src="{0}" style="width: 100px; height:100px;" />'.format(obj.general_photo.url))

# @admin.register(Services)
# class ServicesAdmin(admin.ModelAdmin):
#     list_display = ("name", "server",  "path", "process_mask", 'otheruser')
#     list_filter = ('server',)



@admin.register(Groups)
class TiersAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'image_tag')
    prepopulated_fields = {"slug": ("name",)}
    def image_tag(self, obj):
        return format_html('<img src="{0}" style="width: 100px; height:100px;" />'.format(obj.photo.url))


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ( "name", "post", "image_tag")

    def image_tag(self, obj):
        return format_html('<img src="{0}" style="width: 100px; height:100px;" />'.format(obj.photo.url))


@admin.register(Services)
class ServicesAdmin(admin.ModelAdmin):
    list_display = ( "name", "description", "image_tag")

    def image_tag(self, obj):
        return format_html('<img src="{0}" style="width: 100px; height:100px;" />'.format(obj.photo.url))




# @admin.register(Logs)
# class LogsAdmin(admin.ModelAdmin):
#     list_display = ("name", "server",  "path", "file_mask")
#     list_filter = ('server',)
# Register your models here.
