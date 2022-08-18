from django.template.defaulttags import url
from django.urls import path, re_path
from .views import *

urlpatterns = [
    # re_path(r'^api/$', MainAPI.as_view()),
    path('', Main.as_view()),
    path('about/', About.as_view(), name='about'),
    path('services/', Services.as_view(), name='services'),
    path('<slug:post_slug>/', ViewGroup.as_view(), name='post'),
    path('<slug:post_slug1>/<slug:post_slug2>/', ViewDetail.as_view(), name='post_detail'),


]
