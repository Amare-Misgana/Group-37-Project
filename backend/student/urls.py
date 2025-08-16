from django.urls import path

from . import views

app_name = "student"

urlpatterns = [
    path("students/", views.StudentListView.as_view(), name="student-list"),
    path("students/<int:pk>/", views.StudentDetailView.as_view(), name="student-detail"),
]
