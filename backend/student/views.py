from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from admin_staff.models import CustomUser, Profile
from django.db.models import F


class StudentManagementView(APIView):
    def get(self, request, student_id):
        try:
            student = CustomUser.objects.get(id=student_id)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": f"A student with id '{student_id}' doesn't exist"},
                status=status.HTTP_404_NOT_FOUND,
            )

        student_profile = Profile.objects.filter(user=student).first()
        if not student_profile:
            return Response(
                {"error": "Profile doesn't exist."}, status=status.HTTP_404_NOT_FOUND
            )

        student_data = {
            "id": student.id,
            "username": student.username,
            "first_name": student.first_name,
            "middle_name": student.middle_name,
            "last_name": student.last_name,
            "age": student.age,
            "gender": student.gender,
            "dorm_number": student.dorm_number,
            "phone_number": student.phone_number,
            "guardian_number": student.guardian_number,
            "field": student.field_of_study_id,
            "password": student_profile.password,
        }

        profile_img = (
            request.build_absolute_uri(student.profile_img.url)
            if student.profile_img
            else None
        )

        return Response({"student": student_data, "student_profile": profile_img})
