from django.http import Http404

from .models import Groups

# menu = [{'title': 'Главная', 'url_name': 'main'},
#         {'title': 'Скачать', 'url_name': 'download'},
#         {'title': 'Инструкции', 'url_name': 'instruction'},
#         {'title': 'Контакты', 'url_name': 'contact'},
#         ]

class DataMixin:
    def get_user_context(self, **kwargs):
        context = kwargs
        # user_menu = menu.copy()
        # if self.request.user.is_authenticated:
        #     context['id_profile'] = str(Producer.objects.get(user_id=self.request.user))
        #     context['check_active'] = Producer.objects.get(user_id=self.request.user).active

        list_obj = Groups.objects.all()
        list_protfolio = list(map(lambda i:{'name':i.name, 'slug':i.slug}, list_obj))
        context['protfolio'] = list_protfolio

        return context


