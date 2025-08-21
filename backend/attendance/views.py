
from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy
from django.utils import timezone
from django.views.generic import CreateView, ListView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import AttendanceSession, AttendanceRecord
from admin_staff.models import CustomUser


class AttendanceCreateView(CreateView):
	model = AttendanceSession
	fields = [
		"type",
		"title",
		"description",
		"program_name",
		"start_time",
		"expiry_time",
	]
	success_url = reverse_lazy("attendance:session_list")


class AttendanceSessionListView(ListView):
	model = AttendanceSession
	context_object_name = "sessions"
	ordering = ["-created_at"]


class MarkStudentAttendanceView(APIView):
	def get(self, request, username: str):
		# Support GET for QR scanners that use GET requests
		return self.post(request, username)

	def post(self, request, username: str):
		"""Mark a student's attendance for a session via QR scan.

		Expects query param: session_id
		Returns JSON only.
		"""
		session_id = request.query_params.get("session_id")
		if not session_id:
			return Response(
				{"error": "session_id query parameter is required"},
				status=status.HTTP_400_BAD_REQUEST,
			)

		# Resolve student by username (from QR) and the session
		student = get_object_or_404(CustomUser, username=username, role="student")
		session = get_object_or_404(AttendanceSession, id=session_id)

		# Check session expiry
		if session.is_expired():
			return Response(
				{"error": "Attendance session has expired"},
				status=status.HTTP_410_GONE,
			)

		# Mark attendance (create or update)
		record, created = AttendanceRecord.objects.get_or_create(
			student=student, session=session, defaults={"attended": True}
		)
		if not created and not record.attended:
			record.attended = True
			record.attended_at = timezone.now()
			record.save(update_fields=["attended", "attended_at"])

		return Response(
			{
				"status": "ok",
				"student": student.username,
				"session_id": session.id,
				"attended": True,
				"created": created,
			}
		)
