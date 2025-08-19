from django.urls import path
from student.views import StudentListView, StudentDetailView, StudentDashboardView
from student.views import StudentSubjectsView
from Project.views import ProjectListView, ProjectDetailView
# from news.views import news_list, index as news_index

urlpatterns = [
    path("students/", StudentListView.as_view(), name="student-list"),
    path("students/<int:pk>/", StudentDetailView.as_view(), name="student-detail"),
    path("students/dashboard/<int:pk>/", StudentDashboardView.as_view(), name="student-dashboard"),
    path("students/dashboard/subjects/<int:pk>/", StudentSubjectsView.as_view(), name="student-dashboard-subjects"),
    path("projects/", ProjectListView.as_view(), name="project-list"),
    path("projects/<int:pk>/", ProjectDetailView.as_view(), name="project-detail"),
    # path("news/", news_list, name="news-list"),
    # path("news/index/", news_index, name="news-index"),
]
