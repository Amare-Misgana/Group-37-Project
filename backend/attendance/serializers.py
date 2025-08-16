from rest_framework import serializers
from .models import AttendanceRecored, LectureAttendance
from student.models import Student


class DiningAttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)

    class Meta:
        model = AttendanceRecored
        fields = ['id', 'student', 'student_name', 'session', 'timestamp']


class LectureAttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.name', read_only=True)

    class Meta:
        model = LectureAttendance
        fields = ['id', 'student', 'lecture', 'present', 'timestamp']
