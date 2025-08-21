from django.urls import path
from .views import (
	AttendanceCreateView,
	AttendanceSessionListView,
	MarkStudentAttendanceView,
)

app_name = "attendance"

urlpatterns = [
	path("create/", AttendanceCreateView.as_view(), name="create_session"),
	path("record/", AttendanceSessionListView.as_view(), name="session_list"),
	path("student-attendance/<str:username>/",MarkStudentAttendanceView.as_view(),name="mark_student_attendance",
	),
]
