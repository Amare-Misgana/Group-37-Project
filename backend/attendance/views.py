from django.shortcuts import render

# Create your views here.

from rest_framework import generics
from attendance.models import LectureAttendance,DiningAttendance
from .serializers import DiningAttendanceSerializer, LectureAttendanceSerializer

class DiningAttendanceListView(generics.ListAPIView):
    queryset = DiningAttendance.objects.all()
    serializer_class = DiningAttendanceSerializer

class LectureAttendanceListView(generics.ListAPIView):
    queryset = LectureAttendance.objects.all()
    serializer_class = LectureAttendanceSerializer
