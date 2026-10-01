import type { Budget } from '../api/budgets';
import { parseDate, periodProgress, startOfToday, toNumber } from './format';

export type BudgetTone = 'ok' | 'close' | 'over';

export const toneStyles: Record<BudgetTone, { bar: string; pill: string; figure: string; label: string }> = {
    ok: { bar: 'bg-success', pill: 'bg-success-tint text-success-ink', figure: 'text-ink', label: 'On track' },
    close: { bar: 'bg-warning', pill: 'bg-warning-tint text-warning-ink', figure: 'text-warning-ink', label: 'Getting close' },
    over: { bar: 'bg-danger', pill: 'bg-danger-tint text-danger-ink', figure: 'text-danger-ink', label: 'Over' },
};

export function budgetStatus(spent: number, limit: number) {
    const ratio = limit > 0 ? spent / limit : 0;
    const tone: BudgetTone = ratio > 1 ? 'over' : ratio >= 0.8 ? 'close' : 'ok';
    return { ratio, tone, left: limit - spent };
}

export function budgetPace(budget: Pick<Budget, 'start_date' | 'end_date'>): number | null {
    if (!budget.start_date || !budget.end_date) return null;
    return periodProgress(parseDate(budget.start_date), parseDate(budget.end_date));
}

// Budgets whose period overlaps [from, to]
export function budgetsOverlapping(budgets: Budget[], from: Date, to: Date): Budget[] {
    return budgets.filter((b) => parseDate(b.start_date) <= to && parseDate(b.end_date) >= from);
}

export function activeBudgets(budgets: Budget[]): Budget[] {
    const today = startOfToday();
    return budgetsOverlapping(budgets, today, today);
}

export function totals(budgets: Budget[]) {
    const limit = budgets.reduce((sum, b) => sum + toNumber(b.amount), 0);
    const spent = budgets.reduce((sum, b) => sum + toNumber(b.spent_so_far), 0);
    return { limit, spent, left: limit - spent };
}
