from django.db import models
from django import forms
import os


# Create your models here.
class Video(models.Model):
    title = models.CharField(max_length=100)
    video_file = models.FileField(upload_to='recognition/static/media_saved/videos')
    filename = models.CharField(max_length=255, default='', editable=False)
    
    def save(self, *args, **kwargs):
        self.filename = os.path.basename(self.video_file.name)
        super().save(*args, **kwargs)
        
    class Meta:
        app_label = 'recognition'
        db_table = 'recognition_video'


class VideoForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = ('title', 'video_file')
