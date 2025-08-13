from django.contrib import admin
from .models import CustomUser, Profile, FieldOfStudy


admin.site.register([CustomUser, Profile, FieldOfStudy])
