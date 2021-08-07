# chat/views.py
from django.shortcuts import render

def index(request):
    return render(request, 'fitness/index.html')

def motivation(request):
    return render(request, 'fitness/motivation.html')

def about(request):
    return render(request, 'fitness/about.html')

def achievements(request):
    return render(request, 'fitness/achievements.html')

def calendar(request):
    return render(request, 'fitness/calendar.html')

def catalogExercise(request):
    return render(request, 'fitness/catalog-exercise.html')

def goalProgressArchive(request):
    return render(request, 'fitness/goal-progress-archive.html')

def goals(request):
    return render(request, 'fitness/goals.html')

def muscleGroups(request):
    return render(request, 'fitness/muscle-groups.html')

def progress(request):
    return render(request, 'fitness/progress.html')

def room(request, room_name):
    return render(request, 'fitness/room.html', {
        'room_name': room_name
    })

