from rest_framework import serializers
from .models import Student
from attendance.models import DiningAttendance, LectureAttendance
from Project.models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "title", "marks"]


class StudentSerializer(serializers.ModelSerializer):
    projects = ProjectSerializer(many=True, read_only=True)
    total_dining = serializers.SerializerMethodField()
    total_attendance = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            "id",
            "name",
            "email",
            "projects",
            "total_dining",
            "total_attendance",
        ]

    def get_total_dining(self, obj):
        return DiningAttendance.objects.filter(student=obj, attended=True).count()

    def get_total_attendance(self, obj):
        """Return total attended lecture + dining counts for this Student."""
        lecture_count = LectureAttendance.objects.filter(student=obj, attended=True).count()
        dining_count = DiningAttendance.objects.filter(student=obj, attended=True).count()
        return lecture_count + dining_count