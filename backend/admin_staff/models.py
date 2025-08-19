from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin,
)


class FieldOfStudy(models.Model):
    field_name = models.CharField(max_length=150)

    def __str__(self):
        return f"Field name: {self.field_name}"


class CustomUserManager(BaseUserManager):

    def create_user(self, email, role=None, password=None, **extra_fields):

        if not email:
            raise ValueError("The Email field must be set.")

        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

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
    GENDER_CHOICES = [
        ("m", "Male"),
        ("f", "Female"),
    ]
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    age = models.PositiveSmallIntegerField(default=0)
    phone_number = models.CharField(max_length=150, default=0)
    guardian_number = models.CharField(max_length=150, default=0)
    gender = models.CharField(max_length=10, default="m", choices=GENDER_CHOICES)
    dorm_number = models.PositiveSmallIntegerField(default=0)
    username = models.CharField(max_length=150, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    is_staff = models.BooleanField(default=False)
    profile_img = models.ImageField(upload_to="avatars/", null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    field_of_study = models.ForeignKey(
        FieldOfStudy,
        on_delete=models.CASCADE,
        null=True,
        default=None,
        blank=True,
        related_name="field_of_study_relate_name",
    )

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "middle_name", "last_name"]

    def save(self, *args, **kwargs):
        self.first_name = self.first_name.strip().capitalize()
        self.middle_name = self.middle_name.strip().capitalize()
        self.last_name = self.last_name.strip().capitalize()
        self.username = self.first_name + " " + self.middle_name + " " + self.last_name

        if not self.profile_img:
            self.profile_img = "avatars/default.png"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"User: {self.username} - {self.role}"


class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    password = models.CharField(max_length=100, blank=True)

    def save(self, *args, **kwargs):

        if self.user.role == "admin_staff":
            self.password = ""

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Profile: {self.user.username} - {self.user.role}"


class AdminRecentActions(models.Model):
    admin = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, limit_choices_to={"role": "admin_staff"}
    )
    action = models.CharField(max_length=300)
    action_title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.admin.username} : {self.action_title}"
