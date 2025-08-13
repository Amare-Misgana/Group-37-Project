from django.urls import path
from . import views

app_name = 'news'

urlpatterns = [
    path('', views.index, name='index'),
    path('test/', views.test_websocket, name='test_websocket'),
    path('list/', views.news_list, name='news_list'),
]




