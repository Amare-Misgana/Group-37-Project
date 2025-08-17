from django.urls import path

from . import views

app_name = "attendance"

urlpatterns = [
    # Add attendance URL patterns here. Left empty to satisfy Django include()
    path("dining/", views.DiningAttendanceListView.as_view(), name="dining-attendance"),
    path("lecture/", views.LectureAttendanceListView.as_view(), name="lecture-attendance"),
]
