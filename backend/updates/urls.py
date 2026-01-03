from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UpdateViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r'updates', UpdateViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
