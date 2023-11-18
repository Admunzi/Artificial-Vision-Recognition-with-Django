from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/video/$', consumers.VideoFrames.as_asgi()),
]
