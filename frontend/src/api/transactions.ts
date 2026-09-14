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