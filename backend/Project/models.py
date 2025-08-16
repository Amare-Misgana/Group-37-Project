from django.db import models
from student.models import Student

class Project(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    marks = models.FloatField(default=0)
