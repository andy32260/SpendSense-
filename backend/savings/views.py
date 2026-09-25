from rest_framework import viewsets
from .models import SavingsGoal
from transactions.models import Category
from .serializers import SavingsGoalSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .services import calculate_projection

class SavingsGoalViewSet(viewsets.ModelViewSet):
    serializer_class = SavingsGoalSerializer

    def get_queryset(self):
        return SavingsGoal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SavingsProjectionView(APIView):
    def post(self, request):
        savings_goal_id = request.data.get('savings_goal_id')
        savings_goal = SavingsGoal.objects.get(id=savings_goal_id, user=request.user)
        data = []
        for i in request.data.get('reductions'):
            category_id = i.get('category_id')
            category = Category.objects.get(id=category_id, user=request.user)
            percentage = i.get('percentage')
            data.append((category, percentage))   

        result = calculate_projection(savings_goal, data)
        return Response(result)


