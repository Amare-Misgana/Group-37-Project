from django.urls import path
from . import views
# from news.views import NewsListView, NewsDetailView

urlpatterns = [
    path("", views.index, name="index"),
    path("test/", views.test_websocket, name="test_websocket"),
    path("list/", views.news_list, name="news_list"),
]