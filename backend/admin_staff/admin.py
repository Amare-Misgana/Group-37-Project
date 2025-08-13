from django.contrib import admin
from django.utils.html import mark_safe
from .models import CustomUser, Profile, FieldOfStudy


class CustomUserAdmin(admin.ModelAdmin):
    readonly_fields = ("profile_image_preview", "date_joined")
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "email",
                    "first_name",
                    "middle_name",
                    "last_name",
                    "username",
                    "role",
                    "is_active",
                    "is_staff",
                    "field_of_study",
                    "profile_img",
                    "profile_image_preview",
                    "date_joined",
                )
            },
        ),
    )

    def profile_image_preview(self, obj):
        if obj.profile_img:
            return mark_safe(
                f'<img src="{obj.profile_img.url}" width="150" height="150" />'
            )
        return "-"

    profile_image_preview.short_description = "Profile Image Preview"


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Profile)
admin.site.register(FieldOfStudy)
