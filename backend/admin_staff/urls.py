from django.urls import path
from . import views

urlpatterns = [
    path("add-user/", views.AddUserAPIView.as_view()),
    path("add-users/", views.AddUserAPIView.as_view()),
    path("add-users-excel-template/", views.AddUserExcelTemplateAPIView.as_view()),
]
