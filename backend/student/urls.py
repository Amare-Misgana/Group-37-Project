from django.urls import path
from . import views

urlpatterns = [
    path("student-detail/<int:student_id>/", views.StudentManagementView.as_view()),
]
