from django.db import models
from django.utils.crypto import get_random_string
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin,
)


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


class CustomUserManager(BaseUserManager):

    def create_user(self, email, role=None, password=None, **extra_fields):

        if not email:
            raise ValueError("The Email field must be set.")

        if not role:
            role = "admin_staff"

        if not password:
            password = random_password(add_upper_cases=True)

        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        Profile.objects.create(user=user, password=password)

        return user

    def create_superuser(
        self, email, role="admin_staff", password=None, **extra_fields
    ):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True")
        return self.create_user(email, role, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ("student", "Student"),
        ("mentor", "Mentor"),
        ("admin_staff", "Admin Staff"),
    ]
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "middle_name", "last_name"]

    def __str__(self):
        return f"Email: {self.email}"


class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    password = models.CharField(max_length=100, blank=True)

    def save(self, *args, **kwargs):

        if self._state.adding and self.user.role == "admin_staff":
            self.password = ""

        super().save(*args, **kwargs)


class FieldOfStudy(models.Model):
    field_name = models.CharField(max_length=150)

    def __str__(self):
        return f"Field name: {self.field_name}"
