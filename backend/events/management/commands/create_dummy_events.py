from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from events.models import Event

User = get_user_model()


class Command(BaseCommand):
    help = 'Create dummy events for testing'

    def handle(self, *args, **options):
        # Get or create a test user
        user, created = User.objects.get_or_create(
            email='test@example.com',
            defaults={
                'first_name': 'Test',
                'last_name': 'User',
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(
                self.style.SUCCESS(f'Created test user: {user.email}')
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(f'Using existing test user: {user.email}')
            )

        # Clear existing events
        Event.objects.all().delete()
        self.stdout.write('Cleared existing events')

        # Create dummy events
        now = timezone.now()
        
        dummy_events = [
            {
                'title': 'Tech Meetup: AI & Machine Learning',
                'description': 'Join us for an exciting discussion about the latest trends in AI and machine learning. We\'ll cover topics from basic concepts to advanced implementations.',
                'date_time': now + timedelta(hours=2),
                'location': 'Tech Hub, Downtown',
                'category': 'tech',
                'max_attendees': 50
            },
            {
                'title': 'Networking Event for Entrepreneurs',
                'description': 'Connect with fellow entrepreneurs, investors, and business leaders. Great opportunity to expand your network and share ideas.',
                'date_time': now + timedelta(days=1, hours=18),
                'location': 'Business Center, Main Street',
                'category': 'business',
                'max_attendees': 100
            },
            {
                'title': 'Yoga & Meditation Workshop',
                'description': 'Relax and rejuvenate with our guided yoga and meditation session. Perfect for beginners and experienced practitioners.',
                'date_time': now + timedelta(days=2, hours=9),
                'location': 'Wellness Studio, Park Avenue',
                'category': 'health',
                'max_attendees': 25
            },
            {
                'title': 'Art Exhibition Opening',
                'description': 'Come celebrate the opening of our new contemporary art exhibition featuring works from local and international artists.',
                'date_time': now + timedelta(days=3, hours=19),
                'location': 'Modern Art Gallery, Cultural District',
                'category': 'arts',
                'max_attendees': 75
            },
            {
                'title': 'Cooking Class: Italian Cuisine',
                'description': 'Learn to cook authentic Italian dishes with our professional chef. Includes hands-on cooking and tasting session.',
                'date_time': now + timedelta(days=4, hours=17),
                'location': 'Culinary School, Food Street',
                'category': 'food',
                'max_attendees': 20
            },
            {
                'title': 'Startup Pitch Competition',
                'description': 'Watch innovative startups pitch their ideas to a panel of investors. Great learning opportunity for entrepreneurs.',
                'date_time': now + timedelta(days=5, hours=14),
                'location': 'Innovation Center, Tech Park',
                'category': 'business',
                'max_attendees': 150
            },
            {
                'title': 'Book Club Meeting',
                'description': 'Join our monthly book club discussion. This month we\'re reading "The Lean Startup" by Eric Ries.',
                'date_time': now + timedelta(days=6, hours=15),
                'location': 'Public Library, Central Branch',
                'category': 'education',
                'max_attendees': 30
            },
            {
                'title': 'Fitness Bootcamp',
                'description': 'High-intensity workout session designed to challenge and improve your fitness level. All fitness levels welcome.',
                'date_time': now + timedelta(days=7, hours=7),
                'location': 'City Park, Fitness Area',
                'category': 'sports',
                'max_attendees': 40
            },
            {
                'title': 'Travel Photography Workshop',
                'description': 'Learn professional photography techniques for travel and adventure. Bring your camera and get hands-on experience.',
                'date_time': now + timedelta(days=8, hours=10),
                'location': 'Photography Studio, Arts Quarter',
                'category': 'travel',
                'max_attendees': 15
            },
            {
                'title': 'Social Mixer: Meet & Greet',
                'description': 'Casual social event to meet new people and make connections. Light refreshments will be provided.',
                'date_time': now + timedelta(days=9, hours=18),
                'location': 'Community Center, Downtown',
                'category': 'social',
                'max_attendees': 60
            }
        ]

        created_events = []
        for event_data in dummy_events:
            event = Event.objects.create(
                host=user,
                **event_data
            )
            created_events.append(event)

        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(created_events)} dummy events')
        )
        
        # Display created events
        for event in created_events:
            self.stdout.write(f'- {event.title} ({event.date_time.strftime("%Y-%m-%d %H:%M")})')
