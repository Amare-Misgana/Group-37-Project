from rest_framework import serializers
from .models import Student
from attendance.models import DiningAttendance, LectureAttendance
from Project.models import Project
from django.db.models import Avg, Max, Min


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "title", "description", "marks", "type", "subject", "date"]


class StudentSerializer(serializers.ModelSerializer):
    projects = ProjectSerializer(many=True, read_only=True)
    total_dining = serializers.SerializerMethodField()
    total_attendance = serializers.SerializerMethodField()
    total_lecture = serializers.SerializerMethodField()
    score = serializers.SerializerMethodField()
    projects_completed = serializers.SerializerMethodField()
    total_assignments = serializers.SerializerMethodField()
    highest_grade = serializers.SerializerMethodField()
    lowest_grade = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            "id",
            "name",
            "email",
            "projects",
            "projects_completed",
            "score",
            "total_assignments",
            "highest_grade",
            "lowest_grade",
            "total_dining",
            "total_lecture",
            "total_attendance",
        ]

    def get_total_dining(self, obj):
        return DiningAttendance.objects.filter(student=obj, attended=True).count()

    def get_total_attendance(self, obj):
        """Return total attended lecture + dining counts for this Student."""
        lecture_count = LectureAttendance.objects.filter(student=obj, attended=True).count()
        dining_count = DiningAttendance.objects.filter(student=obj, attended=True).count()
        return lecture_count + dining_count

    def get_total_lecture(self, obj):
        return LectureAttendance.objects.filter(student=obj, attended=True).count()

    def get_score(self, obj):
        """Compute student's score as average of project marks (0 if no projects)."""
        agg = Project.objects.filter(student=obj).aggregate(avg=Avg('marks'))
        avg = agg.get('avg')
        return float(avg) if avg is not None else 0.0

    def get_projects_completed(self, obj):
        # Consider a project 'completed' if it has marks > 0
        return Project.objects.filter(student=obj, marks__gt=0).count()

    def get_total_assignments(self, obj):
        return Project.objects.filter(student=obj).count()

    def get_highest_grade(self, obj):
        agg2 = Project.objects.filter(student=obj).aggregate(max=Max('marks'))
        return float(agg2.get('max')) if agg2.get('max') is not None else 0.0

    def get_lowest_grade(self, obj):
        agg2 = Project.objects.filter(student=obj).aggregate(min=Min('marks'))
        return float(agg2.get('min')) if agg2.get('min') is not None else 0.0