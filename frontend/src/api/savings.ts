import apiClient from './client';

export interface SavingsGoals {
    id: number;
    user: number; 
    name: string;
    target_amount: string;
    target_date: string;
    created_at: string;
    current_amount: string;
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

export async function editSavingsGoal(
  id: number,
  name: string,
  target_amount: string,
  target_date: string,
): Promise<SavingsGoals> {
  const response = await apiClient.patch(`savings-goals/${id}/`, { name, target_amount, target_date });
  return response.data;
}

export async function getSavingsGoal(id: string): Promise<SavingsGoals> {
  const response = await apiClient.get(`savings-goals/${id}/`);
  return response.data;
}

export interface Reduction {
  category_id: number;
  percentage: number;
}

export async function getProjection(savingsGoalId: number, reductions: Reduction[]): Promise<number> {
  const response = await apiClient.post('savings-goals/projection/', {
    savings_goal_id: savingsGoalId,
    reductions: reductions,
  });
  return response.data;
}