from django.shortcuts import render
from .models import VideoForm
from yolo8.yolo8_detection import detect_objects_in_video

def index(request):
    if request.method == 'POST':
        form = VideoForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            video_path = form.instance.video_file.path
            print(video_path)
            detect_objects_in_video(video_path)
    else:
        form = VideoForm()
    return render(request, 'index.html', {"form": form})
