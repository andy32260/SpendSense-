import apiClient from './client';

export interface SavingsGoals {
    id: number;
    user: number; 
    name: string;
    target_amount: string;
    target_date: string;
    created_at: string;
}

export async function getSavingsGoals(): Promise<SavingsGoals[]> {
  const response = await apiClient.get('savings-goals/');
  return response.data;
}