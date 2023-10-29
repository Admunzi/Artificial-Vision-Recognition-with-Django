from django.db import models
from django import forms

# Create your models here.
class Video(models.Model):
    title = models.CharField(max_length=100)
    video_file = models.FileField(upload_to='videos/no-process/')
    
    class Meta:
        app_label = 'recognition'
        db_table = 'recognition_video'

class VideoForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = ('title', 'video_file')