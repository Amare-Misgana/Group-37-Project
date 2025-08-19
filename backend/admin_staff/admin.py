from django.contrib import admin
from django.utils.html import mark_safe
from .models import CustomUser, Profile, FieldOfStudy, AdminRecentActions


class CustomUserAdmin(admin.ModelAdmin):
    readonly_fields = ("user_id_display", "profile_image_preview", "date_joined")

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "user_id_display",  # show ID here
                    "email",
                    "first_name",
                    "middle_name",
                    "last_name",
                    "username",
                    "age",
                    "gender",
                    "phone_number",
                    "guardian_number",
                    "dorm_number",
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

    def user_id_display(self, obj):
        return obj.id

    user_id_display.short_description = "User ID"

    def profile_image_preview(self, obj):
        if obj.profile_img:
            return mark_safe(
                f'<img src="{obj.profile_img.url}" width="150" height="150" />'
            )
        return "-"

    profile_image_preview.short_description = "Profile Image Preview"


class CustomProfileAdmin(admin.ModelAdmin):
    readonly_fields = ("user_id_display",)

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "user_id_display",
                    "user",
                    "password",
                )
            },
        ),
    )

    def user_id_display(self, obj):
        return obj.user.id if obj.user else None

    user_id_display.short_description = "User ID"


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Profile, CustomProfileAdmin)
admin.site.register(FieldOfStudy)
admin.site.register(AdminRecentActions)
