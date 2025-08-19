

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView
from admin_staff.views import EmailBasedTokenObtainPairView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", EmailBasedTokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),
    path("admin_staff/", include("admin_staff.urls")),
    path("", include("student.urls")),
    path("mentor/", include("mentor.urls")),
    path("news/", include("news.urls")),
    path("", include("attendance.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
