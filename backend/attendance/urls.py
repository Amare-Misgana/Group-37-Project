# NOTE: Merge conflict resolved: kept br-2 URLs and app_name; removed main's empty urlpatterns.

from django.urls import path
from . import views

app_name = "attendance"

urlpatterns = [
    path("dining/", views.DiningAttendanceListView.as_view(), name="dining-attendance"),
    path("lecture/", views.LectureAttendanceListView.as_view(), name="lecture-attendance"),
]