from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser, FieldOfStudy, Profile
from .serializers import EmailBasedTokenObtainPairSerializer, ExcelUploadSerializer
from .utils.random_password import random_password
import pandas as pd
from io import BytesIO
from datetime import timedelta
from collections import defaultdict
from django.db.models import Count, Q, Min, Max
from django.http import JsonResponse
from django.utils import timezone
from attendance.models import AttendanceRecord, AttendanceSession


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
        # Define headers only
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

        # Create empty DataFrame with headers
        df = pd.DataFrame(columns=columns)

        # Save to an in-memory buffer
        buffer = BytesIO()
        df.to_excel(buffer, index=False, engine="openpyxl")
        buffer.seek(0)

        response = HttpResponse(
            buffer,
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        response["Content-Disposition"] = 'attachment; filename="user_template.xlsx"'
        return response


class AddUserExcelAPIView(APIView):
    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response(
                {"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            df = pd.read_excel(file)
        except Exception as e:
            return Response(
                {"error": f"Invalid Excel file: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Required columns
        required_columns = [
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
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return Response(
                {"error": f"Missing columns: {', '.join(missing_columns)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        errors = []

        # Check each row for empty or invalid types
        for index, row in df.iterrows():
            for col in required_columns:
                value = row[col]

                if pd.isna(value) or (isinstance(value, str) and not value.strip()):
                    errors.append(
                        {
                            "row": index + 2,
                            "column": col,
                            "error": "This field is required",
                        }
                    )
                    continue

                if col == "Age" or col == "Guardian Number" or col == "Phone Number":
                    if not isinstance(value, (int, float)) or pd.isna(value):
                        errors.append(
                            {
                                "row": index + 2,
                                "column": col,
                                "error": f"{col} must be a number",
                            }
                        )
                else:
                    if not isinstance(value, str):
                        errors.append(
                            {
                                "row": index + 2,
                                "column": col,
                                "error": f"{col} must be a string",
                            }
                        )

        email_list = df["Email"].tolist()
        duplicate_emails = [
            email for email in set(email_list) if email_list.count(email) > 1
        ]
        for email in duplicate_emails:
            dup_rows = df.index[df["Email"] == email].tolist()
            for r in dup_rows:
                errors.append(
                    {
                        "row": r + 2,
                        "column": "Email",
                        "error": "Duplicate email in Excel",
                    }
                )

        existing_emails = set(CustomUser.objects.values_list("email", flat=True))
        for index, email in enumerate(email_list):
            if email in existing_emails:
                errors.append(
                    {
                        "row": index + 2,
                        "column": "Email",
                        "error": "Email already exists in database",
                    }
                )

        if errors:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        data = df.to_dict(orient="records")

        try:
            users = [
                CustomUser(
                    first_name=str(row["First Name"]).strip().capitalize(),
                    middle_name=str(row["Middle Name"]).strip().capitalize(),
                    last_name=str(row["Last Name"]).strip().capitalize(),
                    username=(
                        f"{str(row['First Name']).strip().capitalize()} "
                        f"{str(row['Middle Name']).strip().capitalize()} "
                        f"{str(row['Last Name']).strip().capitalize()}"
                    ),
                    profile_img="avatars/default.png",
                    email=row["Email"],
                    age=int(row["Age"]),
                    gender=row["Gender"],
                    phone_number=int(row["Phone Number"]),
                    guardian_number=int(row["Guardian Number"]),
                    role=row["Role"],
                )
                for row in data
            ]

            CustomUser.objects.bulk_create(users)
        except Exception as e:
            return Response(
                {"error": f"Invalid Excel file: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"status": "Users are created", "data": data}, status=status.HTTP_200_OK
        )


class DashboardView(APIView):
    def get(self, request):
        # countable status: total students, mentors, fields and dorm room
        counts = CustomUser.objects.aggregate(
            total_students=Count("id", filter=Q(role="student")),
            total_mentors=Count("id", filter=Q(role="mentor")),
            total_dorm_rooms=Count("id", filter=~Q(dorm_number=0)),
        )
        total_fields = FieldOfStudy.objects.all().count()

        # Getting the boudners.
        bounds = AttendanceSession.objects.filter(type="dining").aggregate(
            first=Min("start_time"), last=Max("start_time")
        )
        print(bounds)
        first_dt = bounds["first"]
        last_dt = bounds["last"]

        if not first_dt or not last_dt:
            return Response(
                {
                    "countable": {**counts, "total_fields": total_fields},
                    "dinning_attendace": [],
                }
            )

        first_date = first_dt.date()
        last_date = last_dt.date()

        # create list of days from first to last
        days = []
        current_date = first_date
        while current_date <= last_date:
            days.append(current_date.isoformat())
            current_date += timedelta(days=1)

        qs = AttendanceRecord.objects.filter(
            session__type="dining",
            session__start_time__date__gte=first_date,
            session__start_time__date__lte=last_date,
        )

        aggregated = qs.values(
            "session__start_time__date", "session__program_name"
        ).annotate(
            male_present=Count(
                "id",
                filter=Q(student__gender__in=["male", "Male", "M", "m"], attended=True),
            ),
            female_present=Count(
                "id",
                filter=Q(
                    student__gender__in=["female", "Female", "F", "f"], attended=True
                ),
            ),
            male_total=Count(
                "id", filter=Q(student__gender__in=["male", "Male", "M", "m"])
            ),
            female_total=Count(
                "id", filter=Q(student__gender__in=["female", "Female", "F", "f"])
            ),
            total_present=Count("id", filter=Q(attended=True)),
            total=Count("id"),
        )

        tmp = defaultdict(dict)
        for row in aggregated:
            date_iso = row["session__start_time__date"].isoformat()
            prog = (
                row["session__program_name"] or "unknown"
            ).lower()  # normalize program_name
            tmp[date_iso][prog] = {
                "malePresent": row["male_present"],
                "maleTotal": row["male_total"],
                "femalePresent": row["female_present"],
                "femaleTotal": row["female_total"],
                "totalPresent": row["total_present"],
                "total": row["total"],
            }

        PROGRAMS = ["breakfast", "lunch", "dinner"]

        dinning_attendance_out = []
        for day in days:
            programs = []
            for prog in PROGRAMS:
                stats = tmp.get(day, {}).get(prog)
                if stats:
                    programs.append({"program": prog, **stats})
                else:
                    programs.append(
                        {
                            "program": prog,
                            "malePresent": 0,
                            "maleTotal": 0,
                            "femalePresent": 0,
                            "femaleTotal": 0,
                            "totalPresent": 0,
                            "total": 0,
                        }
                    )
            dinning_attendance_out.append({"date": day, "programs": programs})

        return Response(
            {
                "countable": {**counts, "total_fields": total_fields},
                "dinning_attendace": dinning_attendance_out,
            }
        )
