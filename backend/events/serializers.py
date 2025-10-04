from rest_framework import serializers
from .models import Event, Comment
from accounts.serializers import UserSerializer


class EventSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    attendees = UserSerializer(many=True, read_only=True)
    attendee_count = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    is_past = serializers.ReadOnlyField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'category', 'location', 'date_time',
            'max_attendees', 'host', 'attendees', 'attendee_count', 'is_full',
            'is_past', 'created_at', 'updated_at', 'is_cancelled'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['host'] = self.context['request'].user
        return super().create(validated_data)


class EventListSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)
    attendee_count = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    is_past = serializers.ReadOnlyField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'category', 'location', 'date_time',
            'max_attendees', 'host', 'attendee_count', 'is_full', 'is_past',
            'created_at', 'is_cancelled'
        ]


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'text', 'user', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class EventJoinSerializer(serializers.Serializer):
    def validate(self, attrs):
        event = self.context['event']
        user = self.context['request'].user
        
        if event.is_past:
            raise serializers.ValidationError("Cannot join past events")
        
        if event.is_cancelled:
            raise serializers.ValidationError("Cannot join cancelled events")
        
        if event.is_full:
            raise serializers.ValidationError("Event is full")
        
        if event.attendees.filter(id=user.id).exists():
            raise serializers.ValidationError("Already attending this event")
        
        if event.host == user:
            raise serializers.ValidationError("Cannot join your own event")
        
        return attrs
