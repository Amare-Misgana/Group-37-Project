from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailBasedTokenObtainPairSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.crypto import get_random_string
from .models import CustomUser, FieldOfStudy, Profile
from rest_framework import status


def random_password(
    length=6,
    add_upper_cases=False,
    add_lower_cases=True,
    add_numbers=False,
    add_symbols=False,
):

    upper_letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    lower_letters = "abcdefghijklmnopqrstuvwxyz"
    numbers = "1234567890"
    symbols = "./?@!$%*(+=-_)}{"
    password_allowed_characters = ""

    if add_upper_cases:
        password_allowed_characters += upper_letters
    if add_lower_cases:
        password_allowed_characters += lower_letters
    if add_numbers:
        password_allowed_characters += numbers
    if add_symbols:
        password_allowed_characters += symbols

    return get_random_string(length, allowed_chars=password_allowed_characters)


class EmailBasedTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailBasedTokenObtainPairSerializer


@api_view(["POST"])
def add_user(request):
    first_name = request.data.get("first_name")
    middle_name = request.data.get("middle_name")
    last_name = request.data.get("last_name")
    email = request.data.get("email")
    role = request.data.get("role", "student")
    field_of_study = request.data.get("field_of_study")
    profile_img = request.FILES.get("image")
    password = request.data.get("password", random_password(add_upper_cases=True))
    result_message = []

    if field_of_study:
        try:
            field_of_study_instant = FieldOfStudy.objects.get(field_name=field_of_study)
        except Exception as e:
            return Response(
                {"result": {"messages": str(e)}}, status=status.HTTP_501_NOT_IMPLEMENTED
            )
    else:
        field_of_study_instant = None

    if not first_name:
        result_message.append("First name is required.")
    if not middle_name:
        result_message.append("Second name is required.")
    if not last_name:
        result_message.append("Last name is required.")
    if not email:
        result_message.append("Email is required.")
    elif CustomUser.objects.filter(email=email).exists():
        result_message.append("Email already taken.")

    if not len(result_message) == 0:
        return Response(
            {"result": {"messages": result_message}}, status=status.HTTP_400_BAD_REQUEST
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
            {"result": {"messages": str(e)}}, status=status.HTTP_501_NOT_IMPLEMENTED
        )

    return Response(
        {"result": {"status": "User Created"}}, status=status.HTTP_201_CREATED
    )
