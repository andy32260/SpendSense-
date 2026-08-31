from django.db import models
from django.conf import settings
from transactions.models import Category, Transaction
from django.db.models import Sum

class Budget(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def spent_so_far(self):
        total = Transaction.objects.filter(
            category=self.category,
            user=self.user,
            date__range=(self.start_date, self.end_date)
        ).aggregate(Sum('amount'))
        return total['amount__sum'] or 0
