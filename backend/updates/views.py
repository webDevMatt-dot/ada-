from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Update
from .serializers import UpdateSerializer

class UpdateViewSet(viewsets.ModelViewSet):
    queryset = Update.objects.all()
    serializer_class = UpdateSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Admin/Auth users see everything
        if self.request.user.is_authenticated:
            return Update.objects.all().order_by('-created_at')
        # Public users only see approved
        return Update.objects.filter(is_approved=True).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        update = self.get_object()
        update.is_approved = True
        update.save()
        return Response({'status': 'update approved'})
