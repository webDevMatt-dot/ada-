from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, current_user

router = DefaultRouter(trailing_slash=False)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('me', current_user),
]
