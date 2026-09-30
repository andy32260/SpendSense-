from django.db.models import Sum
from django.db.models.functions import TruncMonth
from statistics import mean
from transactions.models import Transaction

def calculate_projection(savings_goal, category_reductions):
    total_freed_up = 0
    for category, percentage in category_reductions:
        monthly_totals = Transaction.objects.filter(
            user=savings_goal.user,
            category=category
        ).annotate(
            month=TruncMonth('date')
        ).values('month').annotate(
            total=Sum('amount')
        )

        totals = [float(month_data['total']) for month_data in monthly_totals]

        if totals:
            monthly_average = mean(totals)
        else:
            monthly_average = 0

        freed_up = monthly_average * (percentage / 100)
        total_freed_up += freed_up

    remaining = float(savings_goal.target_amount - savings_goal.current_amount)

    if total_freed_up > 0:
        months = remaining / total_freed_up
    else:
        return None

    return months