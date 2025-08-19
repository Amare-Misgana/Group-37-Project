from django.contrib import admin
from .models import News, NewsRead

admin.site.register([News, NewsRead])
