from django.db import models
from django.conf import settings


class Project(models.Model):
    name = models.CharField(max_length=150)
    is_completed = models.BooleanField(default=False)
    field_of_study = models.ForeignKey('admin_staff.FieldOfStudy', on_delete=models.CASCADE)
    out_of = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.name} - {self.out_of}"


class Marks(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    mark = models.PositiveIntegerField()

    def __str__(self):
        student_name = getattr(self.student, 'username', str(self.student))
        project_name = getattr(self.project, 'name', 'Project')
        return f"{student_name} - {project_name}: {self.mark}"
