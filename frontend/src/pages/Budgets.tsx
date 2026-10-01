import { useState, useEffect } from 'react'
import { getBudgets, deleteBudget, type Budget } from '../api/budgets';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import BudgetRow from '../components/BudgetRow';
import Money from '../components/Money';
import Icon from '../components/Icon';
import { activeBudgets, budgetPace, budgetStatus, toneStyles, totals, type BudgetTone } from '../lib/budgetStatus';
import { toNumber } from '../lib/format';

export default function Budgets() {
    const [budgets, setBudgets] = useState<Budget[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            setBudgets(await getBudgets());
        }
        fetchData();
    }, []);

    async function handleDelete(id: number) {
        await deleteBudget(id);
        setBudgets((prev) => (prev ?? []).filter((bdgt) => bdgt.id !== id));
    }

    const all = budgets ?? [];
    // Header counts what's running today; fall back to everything if nothing is
    const running = activeBudgets(all);
    const headerSet = running.length > 0 ? running : all;
    const { limit, left } = totals(headerSet);

    const withStatus = all
        .map((b) => ({ b, status: budgetStatus(toNumber(b.spent_so_far), toNumber(b.amount)) }))
        .sort((x, y) => y.status.ratio - x.status.ratio);
    const counts = withStatus.reduce<Record<BudgetTone, number>>(
        (acc, { status }) => ({ ...acc, [status.tone]: acc[status.tone] + 1 }),
        { ok: 0, close: 0, over: 0 },
    );

    return (
        <div>
            <PageHeader
                label="Budgets"
                headline={<Money value={Math.abs(left)} />}
                kicker={
                    all.length === 0
                        ? 'no budgets yet'
                        : `${left < 0 ? 'over' : 'left'} of £${limit.toFixed(2)} ${running.length > 0 ? 'in budgets running now' : 'across your budgets'}`
                }
                actions={<Link to="/budgets/new" className="btn-primary"><Icon name="plus" className="size-4" /> New budget</Link>}
            >
                {all.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {counts.ok > 0 && <span className={`pill ${toneStyles.ok.pill}`}>{counts.ok} on track</span>}
                        {counts.close > 0 && <span className={`pill ${toneStyles.close.pill}`}>{counts.close} getting close</span>}
                        {counts.over > 0 && <span className={`pill ${toneStyles.over.pill}`}>{counts.over} over</span>}
                    </div>
                )}
            </PageHeader>

            {budgets === null ? (
                <p className="text-ink-soft">Loading…</p>
            ) : all.length === 0 ? (
                <EmptyState title="Nothing budgeted yet." action={{ to: '/budgets/new', label: 'Create a budget' }}>
                    Set a monthly limit for something like groceries or nights out, and we'll show how much is left as you spend.
                </EmptyState>
            ) : (
                <ul className="flex flex-col gap-4">
                    {withStatus.map(({ b }) => (
                        <li key={b.id}>
                            <BudgetRow
                                name={b.category_name ?? 'Budget'}
                                spent={toNumber(b.spent_so_far)}
                                limit={toNumber(b.amount)}
                                startDate={b.start_date}
                                endDate={b.end_date}
                                pace={budgetPace(b)}
                                actions={
                                    <>
                                        <Link to={`/budgets/${b.id}/edit`} className="link-action">Edit</Link>
                                        <button type="button" onClick={() => handleDelete(b.id)} className="link-danger">Delete</button>
                                    </>
                                }
                            />
                        </li>
                    ))}
                </ul>
            )}
            {all.length > 0 && (
                <p className="mt-6 flex items-center gap-2 text-sm text-ink-soft">
                    <span className="inline-block h-4 w-0.75 rounded-full bg-ink" aria-hidden="true" />
                    The dark marker shows where you'd be if you spent evenly across the budget's dates.
                </p>
            )}
        </div>
    );
}
