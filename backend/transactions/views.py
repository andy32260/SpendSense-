from rest_framework import viewsets
from .models import Category, Transaction
from .serializers import CategorySerializer, TransactionSerializer
from rest_framework.response import Response
from .services import detect_recurring_transactions, get_monthly_summary
from rest_framework.views import APIView


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RecurringTransactionsView(APIView):
    def get(self, request):
        results = detect_recurring_transactions(request.user)
        return Response(results)

class MonthlySummaryView(APIView):
    def get(self, request):
        year = int(request.query_params.get('year'))
        month = int(request.query_params.get('month'))
        result = get_monthly_summary(request.user, year, month)
        return Response(result)