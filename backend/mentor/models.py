from django.db import models
from admin_staff.models import FieldOfStudy
from django.conf import settings
from django.core.exceptions import ValidationError
from student.models import Student as StudentModel


class Project(models.Model):
    name = models.CharField(max_length=150)
    is_completed = models.BooleanField(default=False)
    field_of_study = models.ForeignKey(FieldOfStudy, on_delete=models.CASCADE)
    out_of = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.name} - {self.out_of}"


class Marks(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    mark = models.PositiveIntegerField()

    def clean(self):
        # Accept either a Student model instance or a CustomUser with role 'student'
        if isinstance(self.student, StudentModel):
            return

        role = getattr(self.student, "role", None)
        if role != "student":
            raise ValidationError("Mark can only be set to a student.")

    def __str__(self):
        return f"{self.student} - {self.project.name}"
    