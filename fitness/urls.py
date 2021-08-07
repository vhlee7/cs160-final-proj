# chat/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('motivation', views.motivation, name='motivation'),
    path('<str:room_name>/', views.room, name='room'),

]
