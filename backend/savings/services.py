from django.db.models import Avg
from transactions.models import Transaction

def calculate_projection(savings_goal, category_reductions):
    total_freed_up = 0
    for category, percentage in category_reductions:
        average_spend = Transaction.objects.filter(
            user=savings_goal.user,
            category=category
        ).aggregate(Avg('amount'))
         
        monthly_average = float(average_spend['amount__avg']) or 0
        freed_up = monthly_average * (percentage / 100)
        total_freed_up += freed_up

    remaining = float(savings_goal.target_amount - savings_goal.current_amount)

    if total_freed_up > 0:
        months = remaining / total_freed_up 
    else:
        return None

    return months
