import copy
import math

from django.http import Http404, HttpResponse
from django.shortcuts import render, get_object_or_404
from django.views import View
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
# Create your views here.
from .models import *
from .utils import *


class Main(DataMixin, ListView):
    model = Groups
    template_name = 'general/index.html'
    context_object_name = 'posts'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)

        list_items = list(context['object_list'])
        foo = []
        for i in range(int(math.ceil(len(list_items) / 2))):
            try:
                row = {'left': {'name': list_items[i * 2].name,
                                'photo': list_items[i * 2].photo.name,
                                'slug': list_items[i * 2].slug
                                },
                       'right': {'name': list_items[i * 2 + 1].name,
                                 'photo': list_items[i * 2 + 1].photo.name,
                                 'slug': list_items[i * 2 + 1].slug
                                 },

                       }
                foo.append(row)
            except IndexError:
                row = {'left': {'name': list_items[i * 2].name,
                                'photo': list_items[i * 2].photo.name,
                                'slug': list_items[i * 2].slug,
                                },
                       'right': {'name': 'None',
                                 'photo': 'None',
                                 'slug': 'None',
                                 }
                       }
                foo.append(row)

        c_def = self.get_user_context(title='Friends Events')
        context = dict(list(context.items()) + list(c_def.items()) + [('rows', foo)])

        return context


# class ViewGroup(DataMixin, ListView):
#     model = Groups
#     template_name = 'general/index.html'
#     pk_url_kwarg = 'post_slug'
#     context_object_name = 'posts'

# def get_queryset(self):
#     return Projects.objects.filter(group=str(Groups.objects.get(slug=self.request.post_slug)))

class ViewGroup(DataMixin, DetailView):
    model = Groups
    # This file should exist somewhere to render your page
    template_name = 'general/group.html'
    # Should match the value after ':' from url <slug:the_slug>
    slug_url_kwarg = 'post_slug'
    # Should match the name of the slug field on the model
    slug_field = 'slug'  # DetailView's default value: optional

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)
        group_name = context['groups']
        description = group_name.description
        title = group_name.name

        list_items = Projects.objects.filter(group=group_name)

        # grop_slug = Projects.objects.all()[0]
        # print(grop_slug['_group__slug'])

        foo = []
        for i in range(int(math.ceil(len(list_items) / 2))):
            try:
                row = {'left': {'name': list_items[i * 2].name, 'photo': list_items[i * 2].general_photo.name,
                                'url': list_items[i * 2].get_absolute_url()},
                       'right': {'name': list_items[i * 2 + 1].name, 'photo': list_items[i * 2 + 1].general_photo.name,
                                 'url': list_items[i * 2 + 1].get_absolute_url()}}
                foo.append(row)
            except IndexError:
                row = {'left': {'name': list_items[i * 2].name, 'photo': list_items[i * 2].general_photo.name,
                                'url': list_items[i * 2].get_absolute_url()},
                       'right': {'name': 'None', 'photo': 'None', 'url': 'None'}}
                foo.append(row)

        c_def = self.get_user_context(title=f'{title.capitalize()} | Friends Events')
        context = dict(list(context.items()) + list(c_def.items()) + [('rows', foo), ('description', description)])

        return context


class ViewDetail(DataMixin, DetailView):
    template_name = 'general/project2.html'

    # Should match the value after ':' from url <slug:the_slug>
    slug_url_kwarg = 'post_slug2'  # {slug_field: slug_url_kwarg}
    query_pk_and_slug = False
    model = Projects
    context_object_name = 'projects'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)

        c_proj = context['object']
        description = c_proj.description
        video = c_proj.video.name
        video = video if video != '' else 'None'

        title = c_proj.name
        list_items = Photos.objects.filter(project_id=c_proj.pk)

        list_photos = list(map(lambda x: x.photo.url, copy.deepcopy(list_items)))

        foo = []
        for i in range(int(math.ceil(len(list_items) / 2))):
            try:
                row = {'left': list_items[i * 2].photo.name,
                       'right': list_items[i * 2 + 1].photo.name,
                       'l_id': i * 2,
                       'r_id': i * 2 + 1,
                       }
                foo.append(row)
                print(foo)
            except IndexError:
                row = {'left': list_items[i * 2].photo.name,
                       'l_id': i * 2,
                       'right': 'None'}
                foo.append(row)

        c_def = self.get_user_context(title=f'{title.capitalize()} | Friends Events')
        context = dict(list(context.items()) + list(c_def.items()) + [('rows', foo),
                                                                      ('description', description),
                                                                      ('video', video),
                                                                      ('name', title),
                                                                      ('photos', list_photos),
                                                                      ])

        return context


class About(DataMixin, ListView):
    model = Employee
    template_name = 'general/about.html'
    context_object_name = 'employee'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)

        c_def = self.get_user_context(title='О нас | Friends Events')
        context = dict(list(context.items()) + list(c_def.items()))

        return context


class Services(DataMixin, ListView):
    model = Services
    template_name = 'general/services.html'
    context_object_name = 'services'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)

        c_def = self.get_user_context(title='Услуги | Friends Events')
        context = dict(list(context.items()) + list(c_def.items()))

        return context
