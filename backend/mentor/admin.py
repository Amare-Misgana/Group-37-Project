from django.contrib import admin
from .models import Marks, Project

# Register your models here.

admin.site.register(Project)  
admin.site.register(Marks)

