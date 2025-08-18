from rest_framework.views import APIView
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import CustomUser, FieldOfStudy, Profile, AdminRecentActions
from .serializers import EmailBasedTokenObtainPairSerializer, ExcelUploadSerializer
from .utils.random_password import random_password
import pandas as pd
from io import BytesIO
from datetime import timedelta
from collections import defaultdict
from django.db.models import Count, Q, Min, Max, F
from django.http import JsonResponse
from django.utils import timezone
from attendance.models import AttendanceRecord, AttendanceSession
from django.core.validators import validate_email
from django.core.exceptions import ValidationError


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
        counts = CustomUser.objects.aggregate(
            total_students=Count("id", filter=Q(role="student")),
            total_mentors=Count("id", filter=Q(role="mentor")),
            total_dorm_rooms=Count("id", filter=~Q(dorm_number=0)),
        )
        total_fields = FieldOfStudy.objects.count()

        student_totals = CustomUser.objects.aggregate(
            total_students=Count("id", filter=Q(role="student")),
            male_students=Count(
                "id", filter=Q(role="student", gender__in=["male", "M", "Male", "m"])
            ),
            female_students=Count(
                "id",
                filter=Q(role="student", gender__in=["female", "F", "Female", "f"]),
            ),
        )

        dining_attendance_bounds = AttendanceSession.objects.filter(
            type="dining"
        ).aggregate(first=Min("start_time"), last=Max("start_time"))

        first_dt = dining_attendance_bounds["first"]
        last_dt = dining_attendance_bounds["last"]

        if first_dt and last_dt:
            first_date = first_dt.date()
            last_date = last_dt.date()

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
                    filter=Q(student__gender__in=["male", "M"], attended=True),
                ),
                female_present=Count(
                    "id",
                    filter=Q(student__gender__in=["female", "F"], attended=True),
                ),
                total_present=Count("id", filter=Q(attended=True)),
                total=Count("id"),
            )

            tmp = defaultdict(dict)
            for row in aggregated:
                date_iso = row["session__start_time__date"].isoformat()
                prog = (row["session__program_name"] or "unknown").lower()
                tmp[date_iso][prog] = {
                    "malePresent": row["male_present"],
                    "maleTotal": student_totals["male_students"],
                    "femalePresent": row["female_present"],
                    "femaleTotal": student_totals["female_students"],
                    "totalPresent": row["total_present"],
                    "total": student_totals["total_students"],
                }

            PROGRAMS = ["breakfast", "lunch", "dinner"]
            dining_attendance_out = []
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
                                "maleTotal": student_totals["male_students"],
                                "femalePresent": 0,
                                "femaleTotal": student_totals["female_students"],
                                "totalPresent": 0,
                                "total": student_totals["total_students"],
                            }
                        )
                dining_attendance_out.append({"date": day, "programs": programs})
        else:
            dining_attendance_out = []

        early_attendance_bounds = AttendanceSession.objects.exclude(
            type="dining"
        ).aggregate(first=Min("start_time"), last=Max("start_time"))

        first_dt = early_attendance_bounds["first"]
        last_dt = early_attendance_bounds["last"]

        if first_dt and last_dt:
            first_date = first_dt.date()
            last_date = last_dt.date()

            days = []
            current_date = first_date
            while current_date <= last_date:
                days.append(current_date.isoformat())
                current_date += timedelta(days=1)

            qs = AttendanceRecord.objects.filter(
                session__type="early",
                session__start_time__date__gte=first_date,
                session__start_time__date__lte=last_date,
            )

            aggregated = qs.values("session__start_time__date").annotate(
                male_present=Count(
                    "id",
                    filter=Q(student__gender__in=["male", "M"], attended=True),
                ),
                female_present=Count(
                    "id",
                    filter=Q(student__gender__in=["female", "F"], attended=True),
                ),
                total_present=Count("id", filter=Q(attended=True)),
                total=Count("id"),
            )

            tmp = {}
            for row in aggregated:
                date_iso = row["session__start_time__date"].isoformat()
                tmp[date_iso] = {
                    "malePresent": row["male_present"],
                    "maleTotal": student_totals["male_students"],
                    "femalePresent": row["female_present"],
                    "femaleTotal": student_totals["female_students"],
                    "totalPresent": row["total_present"],
                    "total": student_totals["total_students"],
                }

            early_comers_attendance_out = []
            for day in days:
                stats = tmp.get(day)
                if stats:
                    early_comers_attendance_out.append({"date": day, **stats})
                else:
                    early_comers_attendance_out.append(
                        {
                            "date": day,
                            "malePresent": 0,
                            "maleTotal": student_totals["male_students"],
                            "femalePresent": 0,
                            "femaleTotal": student_totals["female_students"],
                            "totalPresent": 0,
                            "total": student_totals["total_students"],
                        }
                    )
        else:
            early_comers_attendance_out = []

        recent_actions_qs = AdminRecentActions.objects.order_by("-created_at")[
            :10
        ].values("admin__username", "action_title", "action", "created_at")

        recent_admin_actions = []
        for action_row in recent_actions_qs:
            recent_admin_actions.append(
                {
                    "admin": action_row["admin__username"],
                    "title": action_row["action_title"],
                    "action": action_row["action"],
                    "created_at": (
                        action_row["created_at"].isoformat()
                        if action_row["created_at"]
                        else None
                    ),
                }
            )

        return Response(
            {
                "countable": {**counts, "total_fields": total_fields},
                "dining_attendance": dining_attendance_out,
                "early_comers_attendance": early_comers_attendance_out,
                "recent_admin_actions": recent_admin_actions,
            }
        )


class MentorManagementView(APIView):
    def get(self, request):

        if request.GET.get("export") == "True":
            mentors = (
                CustomUser.objects.filter(role="mentor")
                .annotate(field=F("field_of_study__field_name"))
                .values(
                    "id",
                    "username",
                    "first_name",
                    "middle_name",
                    "last_name",
                    "field",
                    "age",
                    "phone_number",
                    "guardian_number",
                    "gender",
                    "email",
                )
            )

            for mentor in list(mentors):
                mentor["phone_number"] = str(mentor["phone_number"])
                mentor["guardian_number"] = str(mentor["guardian_number"])
                if not mentor["field"]:
                    mentor["field"] = "Not set"

            df = pd.DataFrame(mentors)
            df.fillna("", inplace=True)
            buf = BytesIO()
            df.to_excel(buf, index=False, engine="openpyxl")
            buf.seek(0)
            response = HttpResponse(
                buf.getvalue(),
                content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            )
            response["Content-Disposition"] = 'attachment; filename="mentors.xlsx"'
            return response

        qs = (
            CustomUser.objects.filter(role="mentor")
            .annotate(field=F("field_of_study__field_name"))
            .values("id", "username", "field", "age")
        )
        mentors = list(qs)

        return Response({"mentors": mentors})

    def post(self, request):
        data = request.data

        errors = []

        first_name = (data.get("first_name") or "").strip()
        middle_name = (data.get("middle_name") or "").strip()
        last_name = (data.get("last_name") or "").strip()
        field = (data.get("field") or "").strip()
        age = (data.get("age") or "").strip()
        phone_number = (data.get("phone_number") or "").strip()
        guardian_number = (data.get("guardian_number") or "").strip()
        gender = (data.get("gender") or "").strip().lower()
        email = (data.get("email") or "").strip()

        if not first_name:
            errors.append({"first_name": "First name can't be empty"})
        if not middle_name:
            errors.append({"middle_name": "Middle name can't be empty"})
        if not last_name:
            errors.append({"last_name": "Last name can't be empty"})
        if not age.isdigit() or int(age) <= 0:
            errors.append({"age": "Age must be a positive number"})
        if not phone_number:
            errors.append({"phone_number": "Phone number is required"})
        if not gender:
            errors.append({"gender": "Gender is required"})
        gender = "f" if "female" else "m"
        gender = "f" if "f" else "m"
        if not field:
            errors.append({"field": "Field can't be empty"})
        else:
            if not FieldOfStudy.objects.filter(field_name=field.lower()).exists():
                errors.append(
                    {"field": "The field you provided does't exist in the database"}
                )
        if not email:
            errors.append({"email": "Email can't be empty"})
        else:
            try:
                validate_email(email)
            except ValidationError:
                errors.append({"email": "Invalid email format"})
        if CustomUser.objects.filter(email=email).exists():
            errors.append({"email": "Email already exists"})

        if errors:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        try:
            mentor = CustomUser.objects.create(
                first_name=first_name,
                middle_name=middle_name,
                last_name=last_name,
                field_of_study=FieldOfStudy.objects.get(field_name=field.lower()),
                age=int(age),
                phone_number=phone_number,
                guardian_number=guardian_number,
                gender=gender,
                email=email,
                role="mentor",
            )
        except Exception as e:
            return Response({"error": str(e)})

        password = random_password(add_upper_cases=True, add_numbers=True)

        mentor.set_password(password)
        mentor.save()
        try:
            Profile.objects.create(user=mentor, password=password)
        except Exception as e:
            return Response({"error": str(e)})

        return Response(
            {"status": f"{mentor.username} created successfully."},
            status=status.HTTP_201_CREATED,
        )


class StudentManagementView(APIView):
    def get(self, request):
        if request.GET.get("export") == "True":
            students = (
                CustomUser.objects.filter(role="student")
                .annotate(field=F("field_of_study__field_name"))
                .values(
                    "id",
                    "username",
                    "first_name",
                    "middle_name",
                    "last_name",
                    "field",
                    "age",
                    "phone_number",
                    "guardian_number",
                    "gender",
                    "dorm_number",
                    "email",
                )
            )
            for student in list(students):
                student["phone_number"] = str(student["phone_number"])
                student["guardian_number"] = str(student["guardian_number"])
                if not student["field"]:
                    student["field"] = "Not set"

            df = pd.DataFrame(students)

            df.fillna("", inplace=True)
            buf = BytesIO()
            df.to_excel(buf, index=False, engine="openpyxl")
            buf.seek(0)
            response = HttpResponse(
                buf.getvalue(),
                content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            )
            response["Content-Disposition"] = 'attachment; filename="students.xlsx"'
            return response

        qs = (
            CustomUser.objects.filter(role="student")
            .annotate(field=F("field_of_study__field_name"))
            .values("id", "username", "field", "age")
        )
        students = list(qs)
        return Response({"students": students})

    def post(self, request):
        data = request.data
        errors = []

        first_name = (data.get("first_name") or "").strip()
        middle_name = (data.get("middle_name") or "").strip()
        last_name = (data.get("last_name") or "").strip()
        field = (data.get("field") or "").strip()
        age = str(data.get("age") or "").strip()
        phone_number = (data.get("phone_number") or "").strip()
        guardian_number = (data.get("guardian_number") or "").strip()
        gender = (data.get("gender") or "").strip().lower()
        dorm_number = str(data.get("dorm_number") or "").strip()
        email = (data.get("email") or "").strip()

        # validations
        if not first_name:
            errors.append({"first_name": "First name can't be empty"})
        if not middle_name:
            errors.append({"middle_name": "Middle name can't be empty"})
        if not last_name:
            errors.append({"last_name": "Last name can't be empty"})
        if not age.isdigit() or int(age) <= 0:
            errors.append({"age": "Age must be a positive number"})
        if not dorm_number.isdigit() or int(dorm_number) <= 0:
            errors.append({"dorm_number": "Dorm number must be a positive number"})
        if not phone_number:
            errors.append({"phone_number": "Phone number is required"})
        if not gender:
            errors.append({"gender": "Gender is required"})
        else:
            gender = "f" if "female" in gender else "m"

        if not field:
            errors.append({"field": "Field can't be empty"})
        else:
            if not FieldOfStudy.objects.filter(field_name__iexact=field).exists():
                errors.append(
                    {"field": "The field you provided doesn't exist in the database"}
                )

        if not email:
            errors.append({"email": "Email can't be empty"})
        else:
            try:
                validate_email(email)
            except ValidationError:
                errors.append({"email": "Invalid email format"})
        if CustomUser.objects.filter(email=email).exists():
            errors.append({"email": "Email already exists"})

        if errors:
            return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        # create student
        try:
            student = CustomUser.objects.create(
                first_name=first_name,
                middle_name=middle_name,
                last_name=last_name,
                field_of_study=FieldOfStudy.objects.get(field_name__iexact=field),
                age=int(age),
                phone_number=phone_number,
                guardian_number=guardian_number,
                dorm_number=int(dorm_number),
                gender=gender,
                email=email,
                role="student",
            )
        except Exception as e:
            return Response({"error": str(e)})

        # generate random password
        password = random_password(add_upper_cases=True, add_numbers=True)
        student.set_password(password)
        student.save()

        try:
            Profile.objects.create(user=student, password=password)
        except Exception as e:
            return Response({"error": str(e)})

        return Response(
            {"status": f"{student.username} created successfully."},
            status=status.HTTP_201_CREATED,
        )


class FieldManagementView(APIView):
    def get(self, request):
        fields = FieldOfStudy.objects.annotate(
            students=Count(
                "field_of_study_relate_name",
                filter=Q(field_of_study_relate_name__role="student"),
            )
        ).values("field_name", "students")

        return Response({"fields": fields}, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data

        field_name = (data.get("field_name") or "").strip().lower()

        if not field_name:
            return Response({"error": {"field_name": "Field name can't be empty"}})

        try:
            FieldOfStudy.objects.create(field_name=field_name)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_406_NOT_ACCEPTABLE)

        return Response(
            {"status": "success", "messsage": "Field created successfully"},
            status=status.HTTP_201_CREATED,
        )
