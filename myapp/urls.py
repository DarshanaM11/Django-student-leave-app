from django.urls import path 
from . import views

urlpatterns =[
    path("", views.home, name="home"),
    path('todos/', views.todos, name='Todos'),
    path('login/',views.user_login, name='login'),
    path('register/',views.register, name='register'),
    path('student_dashboard/', views.student_dashboard, name='student_dashboard'),
    path('about/',views.about,name='about'),
    path('contact/',views.contact,name='contact')
    

    








    

]