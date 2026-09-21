import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pageLink = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
        isActive ? 'bg-white/12 text-white' : 'text-paper/70 hover:text-white'
    }`;

const createLink = ({ isActive }: { isActive: boolean }) =>
    `rounded-full border px-3 py-1 text-xs font-medium transition ${
        isActive
            ? 'border-mint bg-mint/10 text-mint'
            : 'border-white/20 text-paper/75 hover:border-mint hover:text-mint'
    }`;

function Wordmark({ to }: { to: string }) {
    return (
        <Link to={to} className="mr-4 font-display text-xl font-semibold tracking-tight text-paper">
            Spend<span className="text-mint">Sense</span>
        </Link>
    );
}

export default function Navbar() {
    const { accessToken, setTokens } = useAuth();

    if (accessToken) {
        return (
        <nav className="flex flex-wrap items-center gap-x-1 gap-y-2 bg-ink px-6 py-3 text-paper">
            <Wordmark to="/dashboard" />
            <NavLink to="/dashboard" end className={pageLink}>Dashboard</NavLink>
            <NavLink to="/transactions" end className={pageLink}>Transactions</NavLink>
            <NavLink to="/budgets" end className={pageLink}>Budgets</NavLink>
            <NavLink to="/savings-goals" end className={pageLink}>Savings Goals</NavLink>
            <div className="ml-auto flex flex-wrap items-center gap-2">
                <NavLink to="/transactions/new" end className={createLink}>+ Transaction</NavLink>
                <NavLink to="/budgets/new" end className={createLink}>+ Budget</NavLink>
                <NavLink to="/savings-goals/new" end className={createLink}>+ Savings Goal</NavLink>
                <button onClick={() => setTokens(null, null)} className="ml-2 rounded-full px-3.5 py-1.5 text-sm font-medium text-paper/70 transition hover:bg-white/10 hover:text-white">
                    Logout
                </button>
            </div>
        </nav>
        );
    }

    return (
        <nav className="flex items-center justify-between bg-ink px-6 py-3 text-paper">
            <Wordmark to="/login" />
            <Link to="/login" className="rounded-full px-3.5 py-1.5 text-sm font-medium text-paper/70 transition hover:text-white">Login</Link>
        </nav>
    );
}
