import { useState, useEffect } from 'react'
import { getSavingsGoals, deleteSavingsGoal, type SavingsGoals } from '../api/savings';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import Money from '../components/Money';
import Icon from '../components/Icon';
import { daysUntil, formatLongDate, toNumber, weeklyAmount } from '../lib/format';

export default function SavingsGoals() {
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoals[] | null>(null);

    useEffect(() => {
        async function fetchData() {
            setSavingsGoals(await getSavingsGoals());
        }
        fetchData();
    }, []);

    async function handleDelete(id: number) {
        await deleteSavingsGoal(id);
        setSavingsGoals((prev) => (prev ?? []).filter((svg) => svg.id !== id));
    }

    const all = [...(savingsGoals ?? [])].sort((a, b) => a.target_date.localeCompare(b.target_date));
    const totalTarget = all.reduce((sum, g) => sum + toNumber(g.target_amount), 0);

    return (
        <div>
            <PageHeader
                label="Savings goals"
                headline={<Money value={totalTarget} wholePounds />}
                kicker={all.length === 0 ? 'nothing set aside for yet' : `to save across ${all.length} goal${all.length === 1 ? '' : 's'}`}
                actions={
                    <>
                        <Link to="/savings-projection" className="btn-secondary"><Icon name="whatif" className="size-4" /> What if…</Link>
                        <Link to="/savings-goals/new" className="btn-primary"><Icon name="plus" className="size-4" /> New goal</Link>
                    </>
                }
            />

            {savingsGoals === null ? (
                <p className="text-ink-soft">Loading…</p>
            ) : all.length === 0 ? (
                <EmptyState title="What are you saving for?" action={{ to: '/savings-goals/new', label: 'Set a goal' }}>
                    A festival ticket, a new laptop, a safety net. Set a goal and we'll work out how much to put aside each week.
                </EmptyState>
            ) : (
                <ul className="flex flex-col gap-4">
                    {all.map((goal) => {
                        const days = daysUntil(goal.target_date);
                        const weekly = weeklyAmount(toNumber(goal.target_amount), goal.target_date);
                        return (
                            <li key={goal.id} className="card grid items-center gap-x-8 gap-y-4 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:px-6">
                                <div className="min-w-0">
                                    <h2 className="truncate text-xl">{goal.name}</h2>
                                    <p className="text-sm text-ink-soft">by {formatLongDate(goal.target_date)}</p>
                                    <p className="mt-3 flex gap-4">
                                        <Link to={`/savings-goals/${goal.id}/edit`} className="link-action">Edit</Link>
                                        <button type="button" onClick={() => handleDelete(goal.id)} className="link-danger">Delete</button>
                                    </p>
                                </div>
                                <div className="flex flex-col sm:items-end">
                                    <span className="label-caps">Target</span>
                                    <Money value={goal.target_amount} className="text-3xl" />
                                </div>
                                <div className="flex min-w-40 flex-col rounded-field bg-plum-tint px-4 py-3 sm:items-end">
                                    {days > 0 ? (
                                        <>
                                            <span className="font-display text-2xl text-plum">{days} day{days === 1 ? '' : 's'}</span>
                                            <span className="text-sm text-ink-soft tabular-nums">£{weekly?.toFixed(2)} a week</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="font-display text-lg text-plum">Date reached</span>
                                            <Link to={`/savings-goals/${goal.id}/edit`} className="text-sm text-ink-soft underline-offset-4 hover:underline">Set a new date</Link>
                                        </>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
