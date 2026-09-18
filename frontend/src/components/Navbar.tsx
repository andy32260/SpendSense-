import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { accessToken, setTokens } = useAuth();
    
    if (accessToken) {
        return (
        <nav>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/budgets">Budgets</Link>
            <Link to="/savings-goals">Savings Goals</Link>
            <Link to="/transactions/new">Create Transaction</Link>
            <Link to="/budgets/new">Create Budget</Link>
            <Link to="/savings-goals/new">Create Savings Goal</Link>
            <button onClick={() => setTokens(null, null)}>Logout</button>
        </nav>
        );
    }

    if (!accessToken) {
        return (
            <>
             <Link to="/login">Login</Link>
            </>
        );
        

    }
}