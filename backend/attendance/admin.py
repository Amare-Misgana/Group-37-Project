from django.contrib import admin
from .models import AttendanceRecored, AttendanceSession

admin.site.register([AttendanceRecored, AttendanceSession])