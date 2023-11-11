from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("recognition", views.recognition, name="recognition"),
    path("some", views.some, name="some"),
]
