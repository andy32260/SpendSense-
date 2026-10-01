import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBudgets, type Budget } from '../api/budgets';
import { activeBudgets, totals } from '../lib/budgetStatus';
import { monthBounds, periodProgress, startOfToday } from '../lib/format';
import Icon, { type IconName } from './Icon';
import Money from './Money';

const navItems: { to: string; label: string; short: string; icon: IconName }[] = [
    { to: '/dashboard', label: 'Home', short: 'Home', icon: 'home' },
    { to: '/transactions', label: 'Transactions', short: 'Spending', icon: 'list' },
    { to: '/budgets', label: 'Budgets', short: 'Budgets', icon: 'budget' },
    { to: '/savings-goals', label: 'Savings goals', short: 'Goals', icon: 'goal' },
    { to: '/savings-projection', label: 'What if…', short: 'What if', icon: 'whatif' },
];

export function Wordmark({ className = '' }: { className?: string }) {
    return (
        <span className={`font-display text-2xl font-medium tracking-tight text-white ${className}`}>
            spend<span className="text-butter">sense</span>
        </span>
    );
}

// Always-visible "how much is left" panel at the foot of the sidebar
function Runway({ budgets }: { budgets: Budget[] | null }) {
    const today = startOfToday();
    const { start, end } = monthBounds(today.getFullYear(), today.getMonth());
    const dayOfMonth = today.getDate();
    const daysInMonth = end.getDate();
    const month = today.toLocaleDateString('en-GB', { month: 'long' });
    const running = budgets ? activeBudgets(budgets) : [];
    const { limit, spent, left } = totals(running);

    return (
        <div className="flex flex-col gap-2 rounded-card bg-white/8 p-4 text-sm">
            <span className="text-spine-text/80">Day {dayOfMonth} of {daysInMonth} · {month}</span>
            {budgets === null ? (
                <span className="h-7" />
            ) : running.length === 0 ? (
                <>
                    <span className="text-spine-text">No budget running right now.</span>
                    <Link to="/budgets/new" className="font-bold text-butter underline-offset-4 hover:underline">Set one up</Link>
                </>
            ) : (
                <>
                    <Money value={left} className={`text-2xl ${left < 0 ? 'text-[#ffb4ae]' : 'text-white'}`} />
                    <span className="text-spine-text/80">{left < 0 ? 'over across your budgets' : 'left across your budgets'}</span>
                    <div className="relative mt-1 h-2 rounded-full bg-white/15">
                        <div className="absolute inset-y-0 left-0 rounded-full bg-butter" style={{ width: `${Math.min(100, limit > 0 ? (spent / limit) * 100 : 0)}%` }} />
                        <span className="absolute -top-1 -bottom-1 w-0.5 -translate-x-1/2 rounded-full bg-white" style={{ left: `${periodProgress(start, end) * 100}%` }} />
                    </div>
                </>
            )}
        </div>
    );
}

function Flash() {
    const location = useLocation();
    const navigate = useNavigate();
    const flash = (location.state as { flash?: string } | null)?.flash;

    if (!flash) return null;

    function dismiss() {
        navigate(location.pathname, { replace: true, state: null });
    }

    return (
        <div role="status" className="mb-6 flex items-start gap-3 rounded-card border-[1.5px] border-success/30 bg-success-tint px-5 py-4 text-success-ink">
            <Icon name="check" className="mt-0.5 size-5 shrink-0" />
            <p className="flex-1 leading-relaxed">{flash}</p>
            <button type="button" onClick={dismiss} className="shrink-0 cursor-pointer rounded-full p-1 hover:bg-success/15" aria-label="Dismiss">
                <Icon name="close" className="size-4" />
            </button>
        </div>
    );
}

export default function AppShell() {
    const { setTokens } = useAuth();
    const location = useLocation();
    const [budgets, setBudgets] = useState<Budget[] | null>(null);

    // Refresh the runway whenever the page changes, so edits show up straight away
    useEffect(() => {
        getBudgets().then(setBudgets).catch(() => setBudgets([]));
    }, [location.pathname]);

    return (
        <div className="min-h-screen lg:grid lg:grid-cols-[236px_minmax(0,1fr)]">
            {/* Desktop sidebar */}
            <aside className="sticky top-0 hidden h-screen flex-col gap-1.5 bg-spine px-4 py-6 text-spine-text lg:flex">
                <Link to="/dashboard" className="px-3 pb-5"><Wordmark /></Link>
                <Link to="/transactions/new" className="btn-butter mb-5 shadow-ledge-dark">
                    <Icon name="plus" className="size-4" /> Log spending
                </Link>
                <nav className="flex flex-col gap-1" aria-label="Main">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-full px-4 py-2.5 font-bold transition ${
                                    isActive ? 'bg-white/12 text-white' : 'text-spine-text/75 hover:bg-white/6 hover:text-white'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon name={item.icon} className={`size-5 ${isActive ? 'text-butter' : ''}`} />
                                    {item.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
                <div className="mt-auto flex flex-col gap-3">
                    <Runway budgets={budgets} />
                    <button
                        type="button"
                        onClick={() => setTokens(null, null)}
                        className="flex cursor-pointer items-center gap-3 rounded-full px-4 py-2.5 text-sm font-bold text-spine-text/75 transition hover:bg-white/6 hover:text-white"
                    >
                        <Icon name="logout" className="size-4" /> Log out
                    </button>
                </div>
            </aside>

            {/* Mobile top bar */}
            <div className="flex items-center justify-between bg-spine px-5 py-3 lg:hidden">
                <Link to="/dashboard"><Wordmark className="text-xl" /></Link>
                <button type="button" onClick={() => setTokens(null, null)} className="cursor-pointer text-sm font-bold text-spine-text/80">
                    Log out
                </button>
            </div>

            <main className="min-w-0 px-5 pt-8 pb-32 sm:px-8 lg:px-12 lg:pt-12 lg:pb-16">
                <div className="mx-auto max-w-6xl">
                    <Flash />
                    <Outlet />
                </div>
            </main>

            {/* Mobile tab bar with a raised "+" in the middle */}
            <nav
                className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 items-end border-t-[1.5px] border-edge bg-surface px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
                aria-label="Main"
            >
                {[navItems[0], navItems[1], null, navItems[2], navItems[3]].map((item) =>
                    item === null ? (
                        <Link
                            key="add"
                            to="/transactions/new"
                            aria-label="Log spending"
                            className="mx-auto -mt-7 grid size-14 place-items-center rounded-full bg-butter text-butter-ink shadow-ledge-butter transition active:translate-y-0.75 active:shadow-none"
                        >
                            <Icon name="plus" className="size-6" />
                        </Link>
                    ) : (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 rounded-field py-1.5 text-[0.7rem] font-bold ${isActive ? 'text-plum' : 'text-ink-soft'}`
                            }
                        >
                            <Icon name={item.icon} className="size-5" />
                            {item.short}
                        </NavLink>
                    ),
                )}
            </nav>
        </div>
    );
}
