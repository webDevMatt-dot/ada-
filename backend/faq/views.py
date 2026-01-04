from rest_framework import viewsets, permissions
from .models import FAQ
from .serializers import FAQSerializer

class FAQViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
