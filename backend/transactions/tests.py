from django.test import TestCase
from django.contrib.auth.models import User
from datetime import date
from .models import Category, Transaction
from .services import detect_recurring_transactions, get_monthly_summary
from decimal import Decimal

class RecurringDetectionTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.category = Category.objects.create(user=self.user, name='Subscriptions')

    def test_detects_recurring_transactions(self):
        Transaction.objects.create(user=self.user, category=self.category, amount=4.99, description="Movie Subscription", date=date(2026, 9, 3))
        Transaction.objects.create(user=self.user, category=self.category, amount=4.99, description="Movie Subscription", date=date(2026, 10, 3))
        Transaction.objects.create(user=self.user, category=self.category, amount=4.99, description="Movie Subscription", date=date(2026, 11, 3))
        results = detect_recurring_transactions(self.user)
        self.assertEqual(len(results), 1)

    def test_ignores_one_off_transactions(self):
        Transaction.objects.create(user=self.user, category=self.category, amount=9.99, description="Netflix Subscription", date=date(2026, 9, 8))
        Transaction.objects.create(user=self.user, category=self.category, amount=4.99, description="Food", date=date(2026, 4, 3))
        Transaction.objects.create(user=self.user, category=self.category, amount=49.99, description="Monitor", date=date(2026, 11, 25))
        results = detect_recurring_transactions(self.user)
        self.assertEqual(len(results), 0)

class MonthlySummaryTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser2', password='testpass123')
        self.category = Category.objects.create(user=self.user, name='Groceries')

    def test_monthly_summary(self):
        Transaction.objects.create(user=self.user, category=self.category, amount=9.99, description="Netflix Subscription", date=date(2026, 8, 8))
        Transaction.objects.create(user=self.user, category=self.category, amount=4.99, description="Food", date=date(2026, 8, 3))
        Transaction.objects.create(user=self.user, category=self.category, amount=49.99, description="Monitor", date=date(2026, 8, 25))
        expected_value = Decimal(9.99) + Decimal(4.99) + Decimal(49.99)
        results = get_monthly_summary(self.user, 2026, 8)
        self.assertAlmostEqual(results[0]['total'], expected_value, places=2)