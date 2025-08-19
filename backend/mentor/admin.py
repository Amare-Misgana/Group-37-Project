from django.contrib import admin
from .models import Project, Marks

admin.site.register([Project, Marks])