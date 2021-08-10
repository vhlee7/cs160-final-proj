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

    path('catalog-exercise-shoulders/', views.catalogExerciseShoulders, name='catalog-exercise-shoulders'),
    path('catalog-exercise-legs/', views.catalogExerciseLegs, name='catalog-exercise-legs'),
    path('catalog-exercise-chest/', views.catalogExerciseChest, name='catalog-exercise-chest'),
    path('catalog-exercise-back/', views.catalogExerciseBack, name='catalog-exercise-back'),
    path('catalog-exercise-arms/', views.catalogExerciseArms, name='catalog-exercise-arms'),
    path('catalog-exercise-abs/', views.catalogExerciseAbs, name='catalog-exercise-abs'),

    path('progress/', views.progress, name='progress'),
    path('<str:room_name>/', views.room, name='room'),

]
