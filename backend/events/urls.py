from django.urls import path
from . import views

urlpatterns = [
    path('', views.EventListCreateView.as_view(), name='event-list-create'),
    path('<int:pk>/', views.EventDetailView.as_view(), name='event-detail'),
    path('<int:event_id>/join/', views.join_event, name='join-event'),
    path('<int:event_id>/leave/', views.leave_event, name='leave-event'),
    path('<int:event_id>/comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),
    path('<int:event_id>/comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
]
