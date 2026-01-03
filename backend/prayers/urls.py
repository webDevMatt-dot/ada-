from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrayerRequestViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r'prayers', PrayerRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
