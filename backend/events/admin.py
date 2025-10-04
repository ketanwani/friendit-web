from django.contrib import admin
from .models import Event, Comment


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'host', 'category', 'location', 'date_time', 'attendee_count', 'is_cancelled')
    list_filter = ('category', 'is_cancelled', 'date_time', 'created_at')
    search_fields = ('title', 'description', 'location', 'host__username', 'host__email')
    ordering = ('-date_time',)
    readonly_fields = ('created_at', 'updated_at', 'attendee_count')
    
    fieldsets = (
        (None, {'fields': ('title', 'description', 'category')}),
        ('Event Details', {'fields': ('location', 'date_time', 'max_attendees')}),
        ('Host & Attendees', {'fields': ('host', 'attendees', 'attendee_count')}),
        ('Status', {'fields': ('is_cancelled',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'text_preview', 'created_at')
    list_filter = ('created_at', 'event__category')
    search_fields = ('text', 'user__username', 'user__email', 'event__title')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    def text_preview(self, obj):
        return obj.text[:50] + '...' if len(obj.text) > 50 else obj.text
    text_preview.short_description = 'Text Preview'
