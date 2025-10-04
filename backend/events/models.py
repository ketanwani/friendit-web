from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.utils import timezone

User = get_user_model()


class Event(models.Model):
    CATEGORY_CHOICES = [
        ('tech', 'Technology'),
        ('business', 'Business'),
        ('social', 'Social'),
        ('education', 'Education'),
        ('health', 'Health & Wellness'),
        ('arts', 'Arts & Culture'),
        ('sports', 'Sports & Fitness'),
        ('food', 'Food & Drink'),
        ('travel', 'Travel'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    location = models.CharField(max_length=200)
    date_time = models.DateTimeField()
    max_attendees = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        null=True,
        blank=True
    )
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosted_events')
    attendees = models.ManyToManyField(User, related_name='attending_events', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_cancelled = models.BooleanField(default=False)

    class Meta:
        ordering = ['date_time']

    def __str__(self):
        return self.title

    @property
    def attendee_count(self):
        return self.attendees.count()

    @property
    def is_full(self):
        if self.max_attendees:
            return self.attendee_count >= self.max_attendees
        return False

    @property
    def is_past(self):
        return self.date_time < timezone.now()


class Comment(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.event.title}"
