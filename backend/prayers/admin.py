from django.contrib import admin
from .models import PrayerRequest

@admin.register(PrayerRequest)
class PrayerRequestAdmin(admin.ModelAdmin):
    list_display = ('author', 'category', 'is_approved', 'likes', 'is_viral', 'created_at')
    list_filter = ('is_approved', 'is_viral', 'category', 'created_at')
    search_fields = ('author', 'content')
    list_editable = ('is_approved', 'is_viral')
