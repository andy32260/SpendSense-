import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { accessToken, setTokens } = useAuth();
    
    if (accessToken) {
        return (
        <nav className="flex items-center gap-6 bg-slate-800 px-6 py-4 text-white">
            <Link to="/dashboard" className="hover:text-blue-400">Dashboard</Link>
            <Link to="/transactions" className="hover:text-blue-400">Transactions</Link>
            <Link to="/budgets" className="hover:text-blue-400">Budgets</Link>
            <Link to="/savings-goals" className="hover:text-blue-400">Savings Goals</Link>
            <Link to="/transactions/new" className="hover:text-blue-400">Create Transaction</Link>
            <Link to="/budgets/new" className="hover:text-blue-400">Create Budget</Link>
            <button onClick={() => setTokens(null, null)} className="ml-auto rounded bg-red-600 px-3 py-1 hover:bg-red-700">
                Logout
            </button>
        </nav>
        );
    }

    return (
        <nav className="bg-slate-800 px-6 py-4 text-white">
            <Link to="/login" className="hover:text-blue-400">Login</Link>
        </nav>
    );
}