from django.db import models
from admin_staff.models import FieldOfStudy
from django.conf import settings


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
        if self.student.role is not "student":
            raise ValueError("Mark can only be set to a student.")

    def __str__(self):
        return f"{self.student} - {self.project.name}"
    