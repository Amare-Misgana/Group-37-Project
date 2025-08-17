from django.contrib import admin

from .models import AttendanceSession,DiningAttendance,LectureAttendance

# Register your models here.

admin.site.register(AttendanceSession) 
admin.site.register(DiningAttendance)
admin.site.register(LectureAttendance)