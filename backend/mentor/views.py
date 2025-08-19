from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from admin_staff.models import CustomUser
from django.db.models import F, Avg, Max, Min


class MentorDashboardView(APIView):
    def get(self, request):
        mentor = CustomUser.objects.filter(role="mentor").first()
        mentor_field = mentor.field_of_study

        # the students that the mentor can teach meaning there field of study should be similar
        students = CustomUser.objects.filter(
            role="student", field_of_study=mentor_field
        )
        students_serialized = students.annotate(
            field=F("field_of_study__field_name")
        ).values(
            "id",
            "username",
            "first_name",
            "middle_name",
            "last_name",
            "age",
            "field",
            "gender",
            "dorm_number",
            "phone_number",
            "guardian_number",
        )
        return Response({"students": students_serialized})
