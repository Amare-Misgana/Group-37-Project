from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser, FieldOfStudy, Profile
from .serializers import EmailBasedTokenObtainPairSerializer
from .utils.random_password import random_password
import pandas as pd
from io import BytesIO


class EmailBasedTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailBasedTokenObtainPairSerializer


class AddUserAPIView(APIView):

    def post(self, request):
        first_name = request.data.get("first_name")
        middle_name = request.data.get("middle_name")
        last_name = request.data.get("last_name")
        email = request.data.get("email")
        role = request.data.get("role", "student").strip().lower()
        field_of_study = request.data.get("field_of_study")
        profile_img = request.FILES.get("image")
        password = request.data.get("password", random_password(add_upper_cases=True))
        result_message = []

        if field_of_study:
            try:
                field_of_study_instant = FieldOfStudy.objects.get(
                    field_name=field_of_study
                )
            except FieldOfStudy.DoesNotExist:
                return Response(
                    {
                        "result": {
                            "messages": f"FieldOfStudy '{field_of_study}' does not exist."
                        }
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            field_of_study_instant = None

        if role not in ["student", "mentor", "admin_staff"]:
            result_message.append(f"'{role}' is not a valid Role.")

        if not first_name:
            result_message.append("First name is required.")
        if not middle_name:
            result_message.append("Middle name is required.")
        if not last_name:
            result_message.append("Last name is required.")
        if not email:
            result_message.append("Email is required.")
        elif CustomUser.objects.filter(email=email).exists():
            result_message.append("Email already taken.")

        if result_message:
            return Response(
                {"result": {"messages": result_message}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = CustomUser.objects.create(
                first_name=first_name,
                middle_name=middle_name,
                last_name=last_name,
                email=email,
                role=role,
                field_of_study=field_of_study_instant,
                profile_img=profile_img,
            )

            user.set_password(password)
            user.save()
            Profile.objects.create(user=user, password=password)

        except Exception as e:
            return Response(
                {"result": {"messages": str(e)}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {"result": {"status": "User Created"}}, status=status.HTTP_201_CREATED
        )


class AddUserExcelTemplateAPIView(APIView):
    def get(self, request):
        columns = [
            "First Name",
            "Middle Name",
            "Last Name",
            "Email",
            "Age",
            "Gender",
            "Phone Number",
            "Guardian Number",
            "Role",
        ]
        df = pd.DataFrame(columns=columns)
        buffer = BytesIO()
        df.to_excel(buffer, index=False, engine="openpyxl")
        buffer.seek(0)

        response = HttpResponse(
            buffer,
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        response["Content-Disposition"] = 'attachment; filename="user_template.xlsx"'
        return response
