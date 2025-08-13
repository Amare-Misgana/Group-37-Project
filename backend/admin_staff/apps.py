from django.apps import AppConfig


class AdminConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "admin_staff"

    def ready(self):
        import admin_staff.signals
