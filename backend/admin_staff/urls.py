from django.urls import path
from . import views

urlpatterns = [
    path("add-user/", views.AddUserAPIView.as_view()),
    path("add-users-excel-template/", views.AddUserExcelTemplateAPIView.as_view()),
    path("add-users-excel/", views.AddUserExcelAPIView.as_view()),
    path("dashboard/", views.DashboardView.as_view()),
]
