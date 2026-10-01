import { useState, useEffect } from 'react'
import { getTransactions, deleteTransaction, getCategories, type Transaction, type Category } from '../api/transactions';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import Money from '../components/Money';
import Icon from '../components/Icon';
import { dayLabel, startOfToday, toNumber } from '../lib/format';
import { categoryColor } from '../lib/categoryColors';

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [filter, setFilter] = useState<number | 'all'>('all');

    useEffect(() => {
        async function fetchData() {
            const [txns, cats] = await Promise.all([getTransactions(), getCategories()]);
            setTransactions(txns);
            setCategories(cats);
        }
        fetchData();
    }, []);

    async function handleDelete(id: number) {
        await deleteTransaction(id);
        setTransactions((prev) => (prev ?? []).filter((txn) => txn.id !== id));
    }

    const all = transactions ?? [];
    const categoryName = (id: number) => categories.find((c) => c.id === id)?.name ?? 'Uncategorised';

    // Header figure: this calendar month
    const today = startOfToday();
    const monthPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const thisMonth = all.filter((t) => t.date.startsWith(monthPrefix));
    const monthTotal = thisMonth.reduce((sum, t) => sum + toNumber(t.amount), 0);
    const monthName = today.toLocaleDateString('en-GB', { month: 'long' });

    // Only offer filters for categories that actually have transactions
    const usedCategoryIds = [...new Set(all.map((t) => t.category))];
    const visible = filter === 'all' ? all : all.filter((t) => t.category === filter);

    // Group by day, newest first
    const days = new Map<string, Transaction[]>();
    [...visible].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).forEach((t) => {
        days.set(t.date, [...(days.get(t.date) ?? []), t]);
    });

    return (
        <div>
            <PageHeader
                label="Transactions"
                headline={<Money value={monthTotal} />}
                kicker={`spent across ${thisMonth.length} payment${thisMonth.length === 1 ? '' : 's'} in ${monthName}`}
                actions={<Link to="/transactions/new" className="btn-primary"><Icon name="plus" className="size-4" /> Add</Link>}
            >
                {usedCategoryIds.length > 1 && (
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                        {(['all', ...usedCategoryIds] as const).map((id) => (
                            <label key={id} className="chip">
                                <input type="radio" name="txn-filter" className="sr-only" checked={filter === id} onChange={() => setFilter(id)} />
                                {id === 'all' ? 'All' : categoryName(id)}
                            </label>
                        ))}
                    </div>
                )}
            </PageHeader>

            {transactions === null ? (
                <p className="text-ink-soft">Loading…</p>
            ) : all.length === 0 ? (
                <EmptyState title="Your first entry is the hardest one." action={{ to: '/transactions/new', label: 'Add a transaction' }}>
                    Log anything you spent today, even a £2.40 coffee. After a week you'll start to see where your money goes.
                </EmptyState>
            ) : (
                <div className="flex flex-col gap-6">
                    {[...days.entries()].map(([date, txns]) => (
                        <section key={date} aria-label={dayLabel(date)} className="flex flex-col gap-2">
                            <h2 className="sticky top-0 z-10 -mx-1 flex justify-between bg-bg/95 px-1 py-2 font-sans text-xs font-bold tracking-[0.08em] text-ink-soft uppercase backdrop-blur">
                                <span>{dayLabel(date)}</span>
                                <span className="tabular-nums">£{txns.reduce((s, t) => s + toNumber(t.amount), 0).toFixed(2)}</span>
                            </h2>
                            <ul className="flex flex-col gap-2">
                                {txns.map((txn) => {
                                    const cat = categoryName(txn.category);
                                    return (
                                        <li key={txn.id} className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 rounded-field border-[1.5px] border-edge bg-surface px-4 py-3">
                                            <span className={`grid size-10 place-items-center rounded-field font-display text-base ${categoryColor(cat).badge}`} aria-hidden="true">
                                                {cat.charAt(0).toUpperCase()}
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block truncate font-bold">{txn.description || cat}</span>
                                                <span className="block text-sm text-ink-soft">{cat}</span>
                                            </span>
                                            <span className="flex flex-col items-end gap-1">
                                                <Money value={txn.amount} className="text-xl" />
                                                <span className="flex gap-3 sm:opacity-0 sm:transition sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                                                    <Link to={`/transactions/${txn.id}/edit`} className="link-action text-xs">Edit</Link>
                                                    <button type="button" onClick={() => handleDelete(txn.id)} className="link-danger text-xs">Delete</button>
                                                </span>
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>
                    ))}
                </div>
            )}
        </div>
    );
}
