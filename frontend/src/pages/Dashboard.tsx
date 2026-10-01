import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { getMonthlySummary, type MonthlySummaryItem, getRecurringTransactions, type RecurringTransactionItem } from '../api/transactions';
import { getBudgets, type Budget } from '../api/budgets';
import { getSavingsGoals, type SavingsGoals } from '../api/savings';
import { budgetPace, budgetsOverlapping, budgetStatus, totals } from '../lib/budgetStatus';
import { capitalise, daysUntil, formatLongDate, greeting, monthBounds, periodProgress, startOfToday, toNumber, weeklyAmount } from '../lib/format';
import { categoryColorByIndex } from '../lib/categoryColors';
import Money from '../components/Money';
import BudgetRow from '../components/BudgetRow';
import Icon from '../components/Icon';

type MonthData = { summary: MonthlySummaryItem[] };

export default function Dashboard() {
    const today = startOfToday();
    const [month, setMonth] = useState({ year: today.getFullYear(), index: today.getMonth() });
    const [monthData, setMonthData] = useState<MonthData | null>(null);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [goals, setGoals] = useState<SavingsGoals[]>([]);
    const [recurring, setRecurring] = useState<RecurringTransactionItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const [b, g, r] = await Promise.all([getBudgets(), getSavingsGoals(), getRecurringTransactions()]);
            setBudgets(b);
            setGoals(g);
            setRecurring(r);
            setLoaded(true);
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchMonth() {
            setMonthData(null);
            const summary = await getMonthlySummary(month.year, month.index + 1);
            setMonthData({ summary });
        }
        fetchMonth();
    }, [month]);

    function shiftMonth(delta: number) {
        const d = new Date(month.year, month.index + delta, 1);
        setMonth({ year: d.getFullYear(), index: d.getMonth() });
    }

    const { start, end } = monthBounds(month.year, month.index);
    const monthName = start.toLocaleDateString('en-GB', { month: 'long' });
    const isCurrentMonth = month.year === today.getFullYear() && month.index === today.getMonth();
    const isFutureMonth = start > today;

    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl tracking-tight sm:text-5xl">{greeting()}.</h1>
                    <p className="text-lg text-ink-soft">
                        {isCurrentMonth ? `Here's ${monthName} so far.` : `Looking back at ${monthName} ${month.year}.`}
                    </p>
                </div>
                <div className="flex items-center gap-2" aria-label="Choose month">
                    <button type="button" onClick={() => shiftMonth(-1)} className="btn-secondary min-h-10 px-3.5" aria-label="Previous month">‹</button>
                    <span className="min-w-36 text-center font-display text-lg">{monthName} {month.year}</span>
                    <button type="button" onClick={() => shiftMonth(1)} className="btn-secondary min-h-10 px-3.5" aria-label="Next month" disabled={isCurrentMonth}>›</button>
                </div>
            </header>

            {!loaded ? (
                <p className="text-ink-soft">Loading your month…</p>
            ) : (
                <div className="grid gap-4 lg:grid-cols-12">
                    <HeroTile
                        budgets={budgetsOverlapping(budgets, start, end)}
                        summary={monthData?.summary ?? null}
                        monthName={monthName}
                        pace={isFutureMonth ? 0 : periodProgress(start, end)}
                        daysLeft={isCurrentMonth ? end.getDate() - today.getDate() + 1 : 0}
                    />
                    <GoalTile goals={goals} />
                    <RepeatsTile recurring={recurring} />
                    <WhereTile summary={monthData?.summary ?? null} monthName={monthName} />
                    <NeedsLookTile budgets={budgetsOverlapping(budgets, start, end)} />
                </div>
            )}
        </div>
    );
}

/* ---------------- Tiles ---------------- */

function HeroTile({ budgets, summary, monthName, pace, daysLeft }: {
    budgets: Budget[]; summary: MonthlySummaryItem[] | null; monthName: string; pace: number; daysLeft: number;
}) {
    const tile = 'flex flex-col justify-between gap-6 rounded-card border-[1.5px] border-butter-deep bg-butter p-6 text-butter-ink shadow-ledge-butter sm:p-8 lg:col-span-8 lg:row-span-2';

    if (budgets.length === 0) {
        const spent = (summary ?? []).reduce((sum, s) => sum + toNumber(s.total), 0);
        return (
            <section className={tile}>
                <span className="label-caps text-butter-ink/75">Spent in {monthName}</span>
                <Money value={spent} className="text-6xl sm:text-7xl lg:text-8xl" />
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="max-w-sm leading-relaxed">Set a budget and this becomes how much you have <em>left</em> to spend, with a marker showing if you're on pace.</p>
                    <Link to="/budgets/new" className="btn-primary">Set a budget</Link>
                </div>
            </section>
        );
    }

    const { limit, spent, left } = totals(budgets);
    const spentRatio = limit > 0 ? spent / limit : 0;
    const over = left < 0;

    let paceLine = '';
    if (over) paceLine = "It happens. The tiles on the right show where.";
    else if (daysLeft > 0) {
        const perDay = left / daysLeft;
        const where = spentRatio > pace + 0.05 ? 'A little ahead of pace' : 'On pace';
        paceLine = `${where} · £${perDay.toFixed(2)} a day for the next ${daysLeft} day${daysLeft === 1 ? '' : 's'}`;
    }

    return (
        <section className={tile}>
            <span className="label-caps text-butter-ink/75">{over ? `Over budget in ${monthName}` : `Left to spend in ${monthName}`}</span>
            <Money value={Math.abs(left)} className="text-6xl sm:text-7xl lg:text-8xl" />
            <div className="flex flex-col gap-3">
                <div
                    className="relative h-4 rounded-full bg-butter-ink/10"
                    role="progressbar"
                    aria-label={`${Math.round(spentRatio * 100)}% of this month's budgets spent`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(Math.min(100, spentRatio * 100))}
                >
                    <div className={`absolute inset-y-0 left-0 rounded-full ${over ? 'bg-danger' : 'bg-butter-ink'}`} style={{ width: `${Math.min(100, spentRatio * 100)}%` }} />
                    {pace > 0 && pace < 1 && (
                        <span className="absolute -top-1.5 -bottom-1.5 w-1 -translate-x-1/2 rounded-full bg-butter-ink ring-2 ring-butter" style={{ left: `${pace * 100}%` }} title="Where you'd be if you spent evenly" />
                    )}
                </div>
                <div className="flex flex-wrap justify-between gap-x-6 gap-y-1 text-sm font-bold">
                    <span className="tabular-nums">£{spent.toFixed(2)} spent of £{limit.toFixed(2)}</span>
                    {paceLine && <span>{paceLine}</span>}
                </div>
            </div>
        </section>
    );
}

function GoalTile({ goals }: { goals: SavingsGoals[] }) {
    const upcoming = goals
        .filter((g) => daysUntil(g.target_date) > 0)
        .sort((a, b) => a.target_date.localeCompare(b.target_date));
    const goal = upcoming[0];

    return (
        <section className="card flex flex-col gap-3 lg:col-span-4">
            <span className="label-caps">Next goal</span>
            {goal ? (
                <>
                    <div className="flex items-baseline justify-between gap-3">
                        <h2 className="truncate text-lg">{goal.name}</h2>
                        <Money value={goal.target_amount} wholePounds className="text-lg" />
                    </div>
                    <p className="font-display text-4xl text-plum">
                        {daysUntil(goal.target_date)} <span className="text-xl">days</span>
                    </p>
                    <p className="text-sm leading-relaxed text-ink-soft">
                        Put aside <strong className="text-ink">£{weeklyAmount(toNumber(goal.target_amount), goal.target_date)?.toFixed(2)} a week</strong> to reach it by {formatLongDate(goal.target_date)}.
                    </p>
                </>
            ) : (
                <>
                    <p className="font-display text-xl">What are you saving for?</p>
                    <Link to="/savings-goals/new" className="link-action">Set a goal →</Link>
                </>
            )}
        </section>
    );
}

function RepeatsTile({ recurring }: { recurring: RecurringTransactionItem[] }) {
    const top = [...recurring].sort((a, b) => b.confidence_score - a.confidence_score).slice(0, 3);

    return (
        <section className="card flex flex-col gap-3 lg:col-span-4">
            <span className="label-caps">Repeats we've spotted</span>
            {top.length === 0 ? (
                <p className="text-sm leading-relaxed text-ink-soft">Nothing yet. Rent, subscriptions and other regular payments show up here once they've happened a few times.</p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {top.map((r) => (
                        <li key={r.key} className="flex items-center justify-between gap-3 rounded-field bg-sunken px-4 py-2.5">
                            <span className="min-w-0">
                                <span className="block truncate font-bold">{capitalise(r.key)}</span>
                                <span className="block text-xs text-ink-soft">about every {Math.round(r.avg_interval_days)} days</span>
                            </span>
                            <Money value={r.avg_amount} className="text-lg" />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

function WhereTile({ summary, monthName }: { summary: MonthlySummaryItem[] | null; monthName: string }) {
    const sorted = [...(summary ?? [])]
        .map((s) => ({ name: s.category__name, total: toNumber(s.total) }))
        .filter((s) => s.total > 0)
        .sort((a, b) => b.total - a.total);
    const shown = sorted.length > 5 ? [...sorted.slice(0, 4), { name: 'Everything else', total: sorted.slice(4).reduce((s, x) => s + x.total, 0) }] : sorted;
    const total = shown.reduce((s, x) => s + x.total, 0);

    return (
        <section className="card flex flex-col gap-4 lg:col-span-7">
            <div className="flex items-baseline justify-between gap-3">
                <span className="label-caps">Where it went</span>
                {total > 0 && <Money value={total} className="text-lg text-ink-soft" />}
            </div>
            {summary === null ? (
                <p className="text-sm text-ink-soft">Loading…</p>
            ) : shown.length === 0 ? (
                <p className="text-sm leading-relaxed text-ink-soft">
                    Nothing logged in {monthName}. <Link to="/transactions/new" className="link-action">Add a transaction</Link> and you'll see it split by category here.
                </p>
            ) : (
                <>
                    <div className="flex h-6 gap-1 overflow-hidden rounded-full" aria-hidden="true">
                        {shown.map((s, i) => (
                            <span key={s.name} className={categoryColorByIndex(i).bar} style={{ flexGrow: s.total }} />
                        ))}
                    </div>
                    <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                        {shown.map((s, i) => (
                            <li key={s.name} className="flex items-center gap-2.5">
                                <span className={`size-2.5 shrink-0 rounded-sm ${categoryColorByIndex(i).bar}`} />
                                <span className="truncate">{s.name}</span>
                                <span className="ml-auto text-sm text-ink-soft tabular-nums">{Math.round((s.total / total) * 100)}%</span>
                                <Money value={s.total} className="w-20 text-right" />
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </section>
    );
}

function NeedsLookTile({ budgets }: { budgets: Budget[] }) {
    const flagged = budgets
        .map((b) => ({ b, status: budgetStatus(toNumber(b.spent_so_far), toNumber(b.amount)) }))
        .filter(({ status }) => status.tone !== 'ok')
        .sort((x, y) => y.status.ratio - x.status.ratio);
    const onTrack = budgets.length - flagged.length;

    return (
        <section className="card flex flex-col gap-4 lg:col-span-5">
            <span className="label-caps">Needs a look</span>
            {budgets.length === 0 ? (
                <p className="text-sm leading-relaxed text-ink-soft">Budgets that are getting close to their limit will show up here.</p>
            ) : flagged.length === 0 ? (
                <p className="flex items-center gap-2 font-bold text-success-ink">
                    <Icon name="check" className="size-5" /> Every budget is on track.
                </p>
            ) : (
                <div className="flex flex-col gap-4">
                    {flagged.slice(0, 3).map(({ b }) => (
                        <BudgetRow key={b.id} compact name={b.category_name ?? 'Budget'} spent={toNumber(b.spent_so_far)} limit={toNumber(b.amount)} pace={budgetPace(b)} />
                    ))}
                </div>
            )}
            {budgets.length > 0 && (
                <Link to="/budgets" className="link-action mt-auto">
                    {onTrack > 0 && flagged.length > 0 ? `${onTrack} other${onTrack === 1 ? '' : 's'} on track · see all budgets →` : 'See all budgets →'}
                </Link>
            )}
        </section>
    );
}
