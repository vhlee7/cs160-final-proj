# chat/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('motivation/', views.motivation, name='motivation'),
    path('about/', views.about, name='about'),
    path('goals/', views.goals, name='goals'),
    path('achievements/', views.achievements, name='achievements'),
    path('calendar/', views.calendar, name='calendar'),
    path('catalog-exercise/', views.catalogExercise, name='catalog-exercise'),
    path('goal-progress-archive/', views.goalProgressArchive, name='goal-progress-archive'),
    path('muscle-groups/', views.muscleGroups, name='muscleGroups'),
    path('progress/', views.progress, name='progress'),
    path('<str:room_name>/', views.room, name='room'),

]
