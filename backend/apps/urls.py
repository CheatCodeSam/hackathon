from django.contrib import admin
from django.urls import include, path

app_name = "apps"

urlpatterns = [
    path("chat/", include("apps.war.urls")),
]
