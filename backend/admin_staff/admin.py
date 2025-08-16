from django.contrib import admin
from .models import CustomUser, CustomUserManager,Profile
from django.apps import apps

# Register your models here.

admin.site.register(CustomUser)
admin.site.register(Profile)

