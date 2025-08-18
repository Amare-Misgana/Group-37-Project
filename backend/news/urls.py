from django.urls import path
from . import views

urlpatterns = [
    path("", views.NewsManagementView.as_view()),
    path("<int:news_id>/", views.NewsEditAndGetView.as_view()),
]
