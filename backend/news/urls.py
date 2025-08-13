from django.urls import path

from news.views import notification_view

urlpatterns =[
    path("notifications/" ,notification_view,name ="notification_view" )
]




