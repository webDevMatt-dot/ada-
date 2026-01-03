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
        from django.db.models import Q
        
        # Admin/Auth users
        if self.request.user.is_authenticated:
            queryset = Update.objects.all().order_by('-created_at')
            
            # Restrict 'deleted' visibility:
            # - Admins see everything
            # - Regular users: See all non-deleted, but only their OWN deleted items
            if not (self.request.user.is_staff or self.request.user.is_superuser):
                 queryset = queryset.filter(
                    ~Q(status='deleted') | Q(status='deleted', created_by=self.request.user)
                )

            status_param = self.request.query_params.get('status')
            if status_param:
                queryset = queryset.filter(status=status_param)
            return queryset
            
        # Public users only see live
        return Update.objects.filter(status='live').order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        # If user edits a 'review' status update, move it back to 'pending'
        instance = serializer.instance
        if instance.status == 'review':
             serializer.save(status='pending', rejection_reason=None)
        else:
            serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        update = self.get_object()
        update.status = 'live'
        update.save()
        return Response({'status': 'update approved'})
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def deny(self, request, pk=None):
        update = self.get_object()
        reason = request.data.get('reason', 'No reason provided')
        update.status = 'review'
        update.rejection_reason = reason
        update.save()
        return Response({'status': 'update denied'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def activate(self, request, pk=None):
        update = self.get_object()
        update.status = 'live'
        update.save()
        return Response({'status': 'update activated'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def deactivate(self, request, pk=None):
        update = self.get_object()
        update.status = 'inactive'
        update.save()
        return Response({'status': 'update deactivated'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def delete_soft(self, request, pk=None):
        update = self.get_object()
        
        # Check permissions: Admin OR Owner (if pending/review)
        is_admin = request.user.is_staff or request.user.is_superuser
        is_owner = update.created_by == request.user
        can_delete = is_admin or (is_owner and update.status in ['pending', 'review'])

        if not can_delete:
            return Response(
                {'error': 'You do not have permission to delete this update.'}, 
                status=status.HTTP_403_FORBIDDEN
            )

        update.status = 'deleted'
        update.save()
        return Response({'status': 'update soft deleted'})
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def restore(self, request, pk=None):
        update = self.get_object()
        update.status = 'inactive' # Restore to inactive state for safety
        update.save()
        return Response({'status': 'update restored'})
