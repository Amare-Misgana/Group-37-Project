from django.db import models
import uuid
from django.utils import timezone
from datetime import datetime
from django.conf import settings
from student.models import Student


class AttendanceSession(models.Model):
    TYPE_CHOICES = [
        ("early", "Early Comers"),
        ("dining", "Dining Hall"),
    ]
    DINING_PROGRAM_CHOICES = [
        ("breakfast", "Breakfast"),
        ("lunch", "Lunch"),
        ("dinner", "Dinner"),
    ]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    code = models.CharField(max_length=40, default=uuid.uuid4().hex)
    title = models.CharField(max_length=150, default="Attendance Title")
    description = models.TextField(default="description")
    program_name = models.CharField(
        max_length=20, choices=DINING_PROGRAM_CHOICES, blank=True, null=True
    )
    # Note: using timezone.now is generally safer than datetime.now()
    start_time = models.DateTimeField(default=datetime.now())
    expiry_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.expiry_time

    def __str__(self):
        if self.type == "dining":
            return f"{self.get_program_name_display()} ({self.start_time.strftime('%H:%M')})"
        return f"{self.get_type_display()} session at {self.start_time.strftime('%Y-%m-%d %H:%M')}"


class AttendanceRecord(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={"role": "student"},
    )
    session = models.ForeignKey(AttendanceSession, on_delete=models.CASCADE)
    attended = models.BooleanField(default=False)
    attended_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} is {'attended' if self.attended else 'not attended'}"


class LectureAttendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date = models.DateField()
    attended = models.BooleanField(default=False)
    attended_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Lecture | {self.student} | {self.date} | {'attended' if self.attended else 'not attended'}"


class DiningAttendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date = models.DateField()
    attended = models.BooleanField(default=False)
    attended_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Dining | {self.student} | {self.date} | {'attended' if self.attended else 'not attended'}"