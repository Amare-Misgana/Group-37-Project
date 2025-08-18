from django.urls import path
from . import views

urlpatterns = [
    path("", views.NewsManagementView.as_view()),
    path("<news_id>/", views.NewsManagementView.as_view()),
]
