"""
WSGI config for meetup_clone project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'meetup_clone.settings')

application = get_wsgi_application()
