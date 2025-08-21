from django.urls import path
from .views import NewsManagementView, NewsEditAndGetView

urlpatterns = [
    # List all news and create new
    path("", NewsManagementView.as_view(), name="news_management"),
    # Retrieve/update/patch a single news by id
    path("<int:news_id>/", NewsEditAndGetView.as_view(), name="news_detail"),
]