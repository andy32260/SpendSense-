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

export async function createSavingsGoal(name: string, target_amount: string, target_date: string) {
  const response = await apiClient.post('savings-goals/', { name, target_amount, target_date});
  return response.data;
}

export async function deleteSavingsGoal(id: number): Promise<void> {
  await apiClient.delete(`savings-goals/${id}/`);
}