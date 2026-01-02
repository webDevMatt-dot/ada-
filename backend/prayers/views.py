from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.db.models import Q
from .models import PrayerRequest
from .serializers import PrayerRequestSerializer

class PrayerRequestViewSet(viewsets.ModelViewSet):
    queryset = PrayerRequest.objects.all()
    serializer_class = PrayerRequestSerializer

    def get_queryset(self):
        # Admin view: show all or filter by param
        if self.request.query_params.get('admin') == 'true':
            return PrayerRequest.objects.all().order_by('-created_at')

        # Default filtered list for public view
        if self.action == 'list':
            now = timezone.now()
            cutoff = now - timedelta(hours=48)
            # persistent if viral OR created within last 48h
            return PrayerRequest.objects.filter(
                is_approved=True
            ).filter(
                Q(is_viral=True) | Q(created_at__gte=cutoff)
            ).order_by('-created_at')
        return super().get_queryset()

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        prayer = self.get_object()
        prayer.likes += 1
        if prayer.likes > 500:
            prayer.is_viral = True
        prayer.save()
        return Response({'status': 'liked', 'likes': prayer.likes, 'is_viral': prayer.is_viral})

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        # In a real app, check permissions here
        prayer = self.get_object()
        prayer.is_approved = True
        prayer.save()
        return Response({'status': 'approved'})
