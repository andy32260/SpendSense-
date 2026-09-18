import apiClient from './client';

export interface Transaction {
  id: number;
  category: number;
  amount: string;
  description: string;
  date: string;
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await apiClient.get('transactions/');
  return response.data;
}

export interface MonthlySummaryItem {
  category__name: string;
  total: string;
}

export async function getMonthlySummary(year: number, month: number): Promise<MonthlySummaryItem[]> {
  const response = await apiClient.get('transactions/summary/', {
  params: { year, month }});
  return response.data;
}

export interface RecurringTransactionItem {
  key: string;
  confidence_score: number;
  avg_amount: number;
  interval_score: number;
  avg_interval_days: number;
  occurrences: number;
}

export async function getRecurringTransactions(): Promise<RecurringTransactionItem[]> {
  const response = await apiClient.get('transactions/recurring/');
  return response.data;
}

export interface Category {
  id: number;
  user: number;
  name: string;
  is_default: boolean;
}

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get('categories/');
  return response.data;
}

export async function createTransaction(category: string, amount: string, description: string, date: string): Promise<Transaction> {
  const response = await apiClient.post('transactions/', { category, amount, description, date });
  return response.data;
}