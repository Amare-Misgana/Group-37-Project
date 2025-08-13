from django.db import models
from django.conf import settings
from admin_staff.models import CustomUser


class News(models.Model):
    ROLE_CHOICES = [
        ("all", "All Users"),
        ("student", "Students Only"),
        ("mentor", "Mentors Only"),
        ("admin_staff", "Admin Staff Only"),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    target_roles = models.CharField(max_length=20, choices=ROLE_CHOICES, default="all")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "News"
    
    def __str__(self):
        return self.title


class NewsReaded(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    news = models.ForeignKey(News, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.news.title}"
