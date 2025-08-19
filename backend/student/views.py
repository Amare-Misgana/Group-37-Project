from rest_framework import generics
from .models import Student
from .serializers import StudentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from Project.models import Project
from django.db.models import Avg, Max, Min, Count


class StudentDashboardView(APIView):
    def get(self, request, pk):
        student = get_object_or_404(Student, pk=pk)
        serializer = StudentSerializer(student)
        data = serializer.data
        # Provide a compact dashboard response; frontend can extend as needed
        dashboard = {
            "id": data.get("id"),
            "name": data.get("name"),
            "email": data.get("email"),
            "overall_average": data.get("score"),
            "total_assignments": data.get("total_assignments"),
            "highest_grade": data.get("highest_grade"),
            "lowest_grade": data.get("lowest_grade"),
            "total_dining": data.get("total_dining"),
            "total_lecture": data.get("total_lecture"),
            "total_attendance": data.get("total_attendance"),
            "projects": data.get("projects", []),
        }
        return Response(dashboard)


class StudentSubjectsView(APIView):


    def get(self, request, pk):
        student = get_object_or_404(Student, pk=pk)
        projects = Project.objects.filter(student=student)

        # Group projects by subject (use 'Unspecified' for null/empty)
        subjects_map = {}
        for p in projects:
            subj = p.subject if p.subject else "Unspecified"
            subjects_map.setdefault(subj, []).append(p)

        subjects = []
        for subj, proj_list in subjects_map.items():
            marks_vals = [p.marks for p in proj_list if p.marks is not None]
            avg = float(sum(marks_vals) / len(marks_vals)) if marks_vals else 0.0
            highest = float(max(marks_vals)) if marks_vals else 0.0
            lowest = float(min(marks_vals)) if marks_vals else 0.0

            # Type breakdown
            types = {}
            for t in ("assignment", "quiz", "exam"):
                t_projects = [p for p in proj_list if (p.type or "assignment") == t]
                t_marks = [p.marks for p in t_projects if p.marks is not None]
                types[t] = {
                    "count": len(t_projects),
                    "average": float(sum(t_marks)/len(t_marks)) if t_marks else 0.0,
                }

            assignments = []
            for p in proj_list:
                assignments.append({
                    "id": p.id,
                    "title": p.title,
                    "description": p.description,
                    "marks": float(p.marks) if p.marks is not None else None,
                    "type": p.type,
                    "subject": p.subject,
                    "date": p.date.isoformat() if p.date else None,
                })

            subjects.append({
                "name": subj,
                "average": avg,
                "total_assignments": len(proj_list),
                "highest_grade": highest,
                "lowest_grade": lowest,
                "types": types,
                "assignments": assignments,
            })

        return Response({
            "student": {"id": student.id, "name": student.name, "email": student.email},
            "subjects": subjects,
        })

class StudentListView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class StudentDetailView(generics.RetrieveAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class StudentCreateView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

