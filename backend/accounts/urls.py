from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path('google/', views.google_auth_view, name='google_auth'),
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    path('logout/', views.logout_view, name='logout'),
]
