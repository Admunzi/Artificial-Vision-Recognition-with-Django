from django.urls import path
from .views import traffic_controller
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("traffic_controller", traffic_controller, name="traffic_controller"),
]
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
