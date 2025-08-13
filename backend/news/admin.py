from django.contrib import admin
from .models import News, NewsReaded

admin.site.register([News, NewsReaded])
