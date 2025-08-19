from rest_framework import serializers
from .models import AttendanceRecored, LectureAttendance, DiningAttendance
from student.models import Student


class DiningAttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)

    class Meta:
        model = DiningAttendance
        fields = ['id', 'student', 'student_name', 'date', 'attended', 'attended_at']


class LectureAttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)

    class Meta:
        model = LectureAttendance
        fields = ['id', 'student', 'student_name', 'date', 'attended', 'attended_at']
