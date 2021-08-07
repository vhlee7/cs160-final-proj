# chat/views.py
from django.shortcuts import render

def index(request):
    return render(request, 'fitness/index.html')

def motivation(request):
    return render(request, 'fitness/motivation.html')

def room(request, room_name):
    return render(request, 'fitness/room.html', {
        'room_name': room_name
    })

