from django.urls import path

from . import views

urlpatterns = [
    path("traffic_controller", views.traffic_controller, name="traffic_controller"),
]
