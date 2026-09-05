from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TransactionViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = router.urls

from django.urls import path
from .views import RecurringTransactionsView

urlpatterns = [
    path('transactions/recurring/', RecurringTransactionsView.as_view(), name='recurring-transactions'),
] + router.urls