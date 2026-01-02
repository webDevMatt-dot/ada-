from rest_framework import serializers
from .models import PrayerRequest

class PrayerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrayerRequest
        fields = ['id', 'author', 'category', 'content', 'created_at', 'is_approved', 'likes', 'is_viral']
        read_only_fields = ['id', 'created_at', 'is_approved', 'likes', 'is_viral']
