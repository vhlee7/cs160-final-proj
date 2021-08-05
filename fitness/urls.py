# chat/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<str:room_name>/', views.room, name='room'),
    path('phone', views.phone, name='phone'),
    path('phone2', views.phone2, name='phone2'),

]
