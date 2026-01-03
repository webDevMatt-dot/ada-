from rest_framework import serializers
from .models import Update

class UpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Update
        fields = ['id', 'title', 'description', 'category', 'image', 'created_at', 'team', 'status', 'rejection_reason', 'created_by']
        read_only_fields = ['created_at', 'team', 'created_by']
