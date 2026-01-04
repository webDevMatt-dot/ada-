from django.contrib import admin
from .models import HistoryEvent

@admin.register(HistoryEvent)
class HistoryEventAdmin(admin.ModelAdmin):
    list_display = ('year', 'title')
    search_fields = ('title', 'description')
    ordering = ('-year',)
