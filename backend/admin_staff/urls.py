from django.urls import path
from . import views

urlpatterns = [
    path("add-user/", views.AddUserAPIView.as_view()),
    path("add-users-excel-template/", views.AddUserExcelTemplateAPIView.as_view()),
    path("add-users-excel/", views.AddUserExcelAPIView.as_view()),
    path("dashboard/", views.DashboardView.as_view()),
    path("mentor-mang/", views.MentorManagementView.as_view()),
    path("mentor-mang/<int:mentor_id>/", views.MentorManagementView.as_view()),
    path("student-mang/", views.StudentManagementView.as_view()),
    path("student-mang/<int:student_id>/", views.StudentManagementView.as_view()),
    path("field-mang/", views.FieldManagementView.as_view()),
    path("field-mang/<int:field_id>/", views.FieldManagementDetailView.as_view()),
]
