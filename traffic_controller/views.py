from django.shortcuts import render

# Create your views here.
def traffic_controller(request):
    return render(request, 'traffic_controller.html')
