from django.shortcuts import render
import sys

sys.path.append("..")
from recognition.models import Video


# Create your views here.
def traffic_controller(request):
    detected_objs = Video.objects.all()
    
    return render(
        request, 'traffic_controller.html',
        {"detected_objs": detected_objs}
    )
