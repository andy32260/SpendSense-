from rest_framework import serializers
from .models import Budget

class BudgetSerializer(serializers.ModelSerializer):
    spent_so_far = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = ['id', 'user', 'category', 'amount', 'start_date', 'end_date', 'created_at', 'spent_so_far']
        read_only_fields = ['user']

    def get_spent_so_far(self, obj):
        return obj.spent_so_far()
