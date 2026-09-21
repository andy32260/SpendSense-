import {useState, useEffect} from 'react'
import { getSavingsGoals, deleteSavingsGoal, type SavingsGoals } from '../api/savings';
import { Link } from 'react-router-dom';

export default function SavingsGoals() {
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoals[]>([]);

    useEffect(() => {
    async function fetchData() {
        const result = await getSavingsGoals();
        setSavingsGoals(result);
    }
    fetchData();
    }, []);

    async function handleDelete(id: number) {
      await deleteSavingsGoal(id);
      setSavingsGoals((prev) => prev.filter((svg) => svg.id !== id));
    }
    
    return (
    <div className="page">
      <h1 className="page-title">Savings Goals</h1>
      {savingsGoals.length === 0 ? (
        <div className="empty-state">
          No savings goals yet.
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {savingsGoals.map((svg) => (
            <li key={svg.id} className="card flex flex-col border-line bg-surface">
              <h2 className="text-lg font-semibold text-ink-soft">{svg.name}</h2>
              <p className="figure mt-3 text-4xl text-pine">£{svg.target_amount}</p>
              <p className="mt-2 text-sm text-ink-muted">Target date: {svg.target_date}</p>
              <div className="mt-6 flex gap-4 border-t border-line pt-4">
                <Link to={`/savings-goals/${svg.id}/edit`} className="link-action">
                  Edit
                </Link>
                <button
                onClick={() => handleDelete(svg.id)}
                className="link-danger">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
