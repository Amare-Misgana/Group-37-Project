from django.db import models
import uuid
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from student.models import Student 


class AttendanceSession(models.Model):
    TYPE_CHOICES = [
        ("early", "Early Comers"),
        ("dining", "Dining Hall"),
        ("sports", "Sports Field"),
    ]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    code = models.CharField(max_length=40, default=uuid.uuid4().hex)
    expiry_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.expiry_time


class AttendanceRecored(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE)
    attended = models.BooleanField(default=False)
    attended_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} is attended"
class LectureAttendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date = models.DateField()
