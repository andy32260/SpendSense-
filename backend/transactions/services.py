from collections import defaultdict
from statistics import mean
from .models import Transaction

def detect_recurring_transactions(user):
    transactions = Transaction.objects.filter(user=user).order_by('date')
    
    groups = defaultdict(list)
    for txn in transactions:
        key = clean_description(txn.description)
        groups[key].append(txn)
    
    results = []
    for key, txns in groups.items():
        if len(txns) < 3:
            continue
        # next: calculate gaps, scores, confidence
    
    return results


def clean_description(description):
    return description.lower().strip()
# checks if desc. of a purchase is similar to see if it's a recurring purchase