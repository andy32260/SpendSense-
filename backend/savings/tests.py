from django.test import TestCase
from django.contrib.auth.models import User
from datetime import date
from .models import SavingsGoal
from transactions.models import Transaction, Category
from .services import calculate_projection
from decimal import Decimal

class RecurringDetectionTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.category = Category.objects.create(user=self.user, name='Subscriptions')

    def test_calculate_projection(self):
        Transaction.objects.create(user=self.user, category=self.category, amount=4.99, description="Movie Subscription", date=date(2026, 9, 3))
        Transaction.objects.create(user=self.user, category=self.category, amount=4.99, description="Movie Subscription", date=date(2026, 10, 3))
        Transaction.objects.create(user=self.user, category=self.category, amount=4.99, description="Movie Subscription", date=date(2026, 11, 3))
        
        savings_goal = SavingsGoal.objects.create(user=self.user, name="Emergency Fund", target_amount=1000, target_date=date(2027, 1, 1), current_amount=20)
        category_reductions = [(self.category, 20)]
        results = calculate_projection(savings_goal, category_reductions)
        expected_months = (1000 - 20) / (4.99 * 0.20)
        self.assertAlmostEqual(results, expected_months, places=2)

    def test_projection_with_zero_reduction(self):
        Transaction.objects.create(user=self.user, category=self.category, amount=4.99, description="Movie Subscription", date=date(2026, 9, 3))
        Transaction.objects.create(user=self.user, category=self.category, amount=4.99, description="Movie Subscription", date=date(2026, 10, 3))
        Transaction.objects.create(user=self.user, category=self.category, amount=4.99, description="Movie Subscription", date=date(2026, 11, 3))
        
        savings_goal = SavingsGoal.objects.create(user=self.user, name="Emergency Fund", target_amount=1000, target_date=date(2027, 1, 1), current_amount=20)
        category_reductions = [(self.category, 0)]
        results = calculate_projection(savings_goal, category_reductions)
        self.assertAlmostEqual(results, None)
        