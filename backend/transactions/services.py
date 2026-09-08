from collections import defaultdict
from statistics import mean
from .models import Transaction
from django.db.models import Sum

def clean_description(description):
    return description.lower().strip()
    # ensures all desc. match based on letters only


def detect_recurring_transactions(user):
    transactions = Transaction.objects.filter(user=user).order_by('date')

    # Group transactions by a cleaned version of their description
    # e.g. all "Netflix" charges end up in the same group
    groups = defaultdict(list)
    for txn in transactions:
        key = clean_description(txn.description)
        groups[key].append(txn)

    results = []
    for key, txns in groups.items():
        if len(txns) < 3:
            continue

        # --- Interval consistency ---
        # Work out the day-gap between each consecutive transaction
        gaps = []
        for i in range(len(txns) - 1):
            gap = (txns[i + 1].date - txns[i].date).days
            gaps.append(gap)

        avg_gap = mean(gaps)
        # How far each gap sits from the average (always positive)
        deviations = [abs(gap - avg_gap) for gap in gaps]
        avg_deviation = mean(deviations)

        # Turn deviation into a 0–1 score: tighter gaps = higher score
        max_acceptable_deviation = 5  # days
        interval_score = max(0, 1 - (avg_deviation / max_acceptable_deviation))

        # --- Amount consistency ---
        amounts = [float(txn.amount) for txn in txns]
        avg_amount = mean(amounts)
        deviation = [abs(amount - avg_amount) for amount in amounts]
        avg_deviation_percent = (mean(deviation) / avg_amount) * 100

        max_acceptable_deviation_percent = 15  # %
        amount_score = max(0, 1 - (avg_deviation_percent / max_acceptable_deviation_percent))

        weighted_interval_score = interval_score * 0.6
        weighted_amount_score = amount_score * 0.4
        confidence_score = weighted_interval_score + weighted_amount_score

        results.append({
            "key": key,
            "confidence_score": confidence_score,
            "avg_amount": avg_amount,
            "interval_score": interval_score,
            "avg_interval_days": avg_gap,
            "occurrences": len(txns),
        })

    return results


def get_monthly_summary(user, year, month):
    summary = Transaction.objects.filter(
        user=user,
        date__year=year,
        date__month=month
    ).values('category__name').annotate(total=Sum('amount'))
    
    return list(summary)

