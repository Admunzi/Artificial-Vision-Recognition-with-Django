from django.shortcuts import render
from .models import VideoForm, Video
from .utils import detect_objects_in_video

def recognition(request):
    if request.method == 'POST':
        form = VideoForm(request.POST, request.FILES)
        if form.is_valid():
            instance = form.save()
            video_path = instance.video_file.path
            detect_objects_in_video(video_path, instance.pk)
    else:
        form = VideoForm()
    
    detected_objs = Video.objects.all()
        
    return render(request, 'recognition.html', {"form": form, "detected_objs": detected_objs})
