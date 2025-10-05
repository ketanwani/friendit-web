from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q
from django.utils import timezone
from django.conf import settings
import googlemaps
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


@api_view(['GET'])
@permission_classes([])  # Allow public access
def search_locations(request):
    """
    Search for locations using Google Places API
    """
    query = request.GET.get('query', '').strip()
    
    if not query or len(query) < 2:
        return Response({'results': []})
    
    # Check if API key is loaded
    api_key = settings.GOOGLE_MAPS_API_KEY
    if not api_key:
        print("ERROR: GOOGLE_MAPS_API_KEY is not set!")
        return Response({'error': 'API key not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    try:
        print(f"Searching for: {query}")
        print(f"API Key: {api_key[:10]}...")
        
        # Initialize Google Maps client
        gmaps = googlemaps.Client(key=api_key)
        
        # Search for places
        places_result = gmaps.places(query)
        print(f"Places result: {places_result}")
        
        results = []
        for place in places_result.get('results', [])[:5]:  # Limit to 5 results
            result = {
                'name': place.get('name', ''),
                'address': place.get('formatted_address', ''),
                'lat': place['geometry']['location']['lat'],
                'lng': place['geometry']['location']['lng'],
                'place_id': place.get('place_id', '')
            }
            results.append(result)
        
        print(f"Returning {len(results)} results")
        return Response({'results': results})
        
    except Exception as e:
        print(f"Error searching locations: {e}")
        return Response({'results': []}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
