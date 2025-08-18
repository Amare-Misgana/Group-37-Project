from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from admin_staff.models import CustomUser
from django.db.models import F


class StudentManagementView(APIView):
    def get(self, request, student_id):
        try:
            student = CustomUser.objects.get(id=student_id, role="student")
        except CustomUser.DoesNotExist:
            return Response(
                {"error": f"A student with '{student_id}' id doesn't exist"}
            )

        return Response(
            {
                "student": CustomUser.objects.filter(id=student_id).values(
                    "username",
                    "first_name",
                    "middle_name",
                    "last_name",
                    "age",
                    "gender",
                    "dorm_number",
                    "phone_number",
                    "guardian_number",
                    "field_of_study",
                )
            }
        )
