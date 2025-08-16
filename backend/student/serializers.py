from rest_framework import serializers
from .models import Student
from attendance.models import AttendanceRecored, AttendanceSession,LectureAttendance
from Project.models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'title','marks'  ]

class StudentSerializer(serializers.ModelSerializer):
    projects = ProjectSerializer(many=True, read_only=True)
    total_dining = serializers.SerializerMethodField()
    total_attendance = serializers.SerializerMethodField()


    class Meta:
        model = Student
        fields = ['id', 'name', 'email', 'age', 'gender', 'projects', 'total_dining', 'total_attendance']

    def get_total_dining(self, obj):
        return AttendanceRecored.objects.filter(student=obj, session__type='dining').count()

    def get_total_attendance(self, obj):
        return AttendanceRecored.objects.filter(student=obj).count()