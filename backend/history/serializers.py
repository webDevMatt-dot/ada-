from rest_framework import serializers
from .models import HistoryEvent

class HistoryEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryEvent
        fields = ['id', 'year', 'title', 'description']
