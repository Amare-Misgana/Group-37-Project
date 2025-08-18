from django.db import models
from django.conf import settings


class News(models.Model):
    PRIORITY_CHOICE = [
        ("normal", "Normal"),
        ("important", "Important"),
        ("urgent", "Urgent"),
    ]
    TO_CHOICE = [
        ("student", "Student"),
        ("mentor", "Mentor"),
    ]
    title = models.CharField(max_length=150)
    text = models.TextField()
    priority = models.CharField(
        max_length=20, choices=PRIORITY_CHOICE, default="normal"
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    to = models.CharField(max_length=20, choices=TO_CHOICE, default="student")

    def __str__(self):
        return f"News name: {self.title}"


class NewsRead(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    news = models.ForeignKey(News, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.news.title}"
