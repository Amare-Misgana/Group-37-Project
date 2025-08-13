from django.urls import re_path
from news.consumers import NotificationConsumer


websocket_urlpatterns = [
    re_path('ws/notification/$',NotificationConsumer.as_asgi()),
]
