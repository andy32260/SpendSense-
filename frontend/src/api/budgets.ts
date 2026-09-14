import apiClient from './client';

export interface Budget {
  id: number;
  user: number;
  category: number;
  category_name: string | null;
  amount: string;
  start_date: string;
  end_date: string;
  created_at: string;
  spent_so_far: number;
}

export async function getBudgets(): Promise<Budget[]> {
  const response = await apiClient.get('budgets/');
  return response.data;
}