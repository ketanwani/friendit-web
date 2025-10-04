from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q
from django.utils import timezone
from .models import Event, Comment
from .serializers import EventSerializer, EventListSerializer, CommentSerializer, EventJoinSerializer


class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.filter(is_cancelled=False)
    permission_classes = []  # Allow public access to list events
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'host']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['date_time', 'created_at']
    ordering = ['-date_time']  # Reverse chronological order (newest first)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EventSerializer
        return EventListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter out past events - only show events from today onwards
        now = timezone.now()
        queryset = queryset.filter(date_time__gte=now)
        
        # Filter by date range if provided (keeping for backward compatibility)
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(date_time__gte=start_date)
        if end_date:
            queryset = queryset.filter(date_time__lte=end_date)
        
        return queryset

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.request.method == 'GET':
            permission_classes = []  # No authentication required for listing
        else:
            permission_classes = [IsAuthenticated]  # Authentication required for creating
        
        return [permission() for permission in permission_classes]


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(is_cancelled=False)

    def perform_destroy(self, instance):
        # Soft delete by marking as cancelled
        instance.is_cancelled = True
        instance.save()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id, is_cancelled=False)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = EventJoinSerializer(data={}, context={'event': event, 'request': request})
    serializer.is_valid(raise_exception=True)

    event.attendees.add(request.user)
    return Response({'message': 'Successfully joined event'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def leave_event(request, event_id):
    try:
        event = Event.objects.get(id=event_id, is_cancelled=False)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    if not event.attendees.filter(id=request.user.id).exists():
        return Response({'error': 'Not attending this event'}, status=status.HTTP_400_BAD_REQUEST)

    event.attendees.remove(request.user)
    return Response({'message': 'Successfully left event'}, status=status.HTTP_200_OK)


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        event_id = self.kwargs['event_id']
        return Comment.objects.filter(event_id=event_id)

    def perform_create(self, serializer):
        event_id = self.kwargs['event_id']
        try:
            event = Event.objects.get(id=event_id, is_cancelled=False)
        except Event.DoesNotExist:
            raise serializers.ValidationError("Event not found")
        
        serializer.save(event=event)


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        event_id = self.kwargs['event_id']
        return Comment.objects.filter(event_id=event_id)

    def perform_destroy(self, instance):
        # Only allow the comment author or event host to delete
        if instance.user != self.request.user and instance.event.host != self.request.user:
            raise PermissionError("Not authorized to delete this comment")
        instance.delete()
