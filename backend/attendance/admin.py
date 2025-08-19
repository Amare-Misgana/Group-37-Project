from django.contrib import admin
from .models import AttendanceRecord, AttendanceSession, DiningAttendance, LectureAttendance

admin.site.register([AttendanceRecord, AttendanceSession, DiningAttendance, LectureAttendance])