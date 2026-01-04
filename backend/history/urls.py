from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HistoryEventViewSet

router = DefaultRouter()
router.register(r'history', HistoryEventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
