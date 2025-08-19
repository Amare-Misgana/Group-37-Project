from django.db import models
from student.models import Student

class Project(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    marks = models.FloatField(default=0)
    # Optional: type of the project/assignment (assignment, quiz, exam)
    TYPE_CHOICES = [
        ("assignment", "Assignment"),
        ("quiz", "Quiz"),
        ("exam", "Exam"),
    ]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="assignment")
    # Optional subject name for grouping on the frontend
    subject = models.CharField(max_length=100, null=True, blank=True)
    # Date the project/assignment was given or due
    date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title
