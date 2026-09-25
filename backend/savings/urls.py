from rest_framework.routers import DefaultRouter
from .views import SavingsGoalViewSet, SavingsProjectionView
from django.urls import path

router = DefaultRouter()
router.register(r'savings-goals', SavingsGoalViewSet, basename='savings-goals')

urlpatterns = [
    path('savings-goals/projection/', SavingsProjectionView.as_view(), name='savings-projection'),
] + router.urls