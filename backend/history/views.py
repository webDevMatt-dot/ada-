from rest_framework import viewsets
from .models import HistoryEvent
from .serializers import HistoryEventSerializer

class HistoryEventViewSet(viewsets.ModelViewSet):
    queryset = HistoryEvent.objects.all()
    serializer_class = HistoryEventSerializer
