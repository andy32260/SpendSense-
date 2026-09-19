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
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Savings Goals</h1>
      {savingsGoals.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center text-sm text-slate-500 shadow">
          No savings goals yet.
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {savingsGoals.map((svg) => (
            <li key={svg.id} className="rounded-lg bg-white p-6 shadow">
              <h2 className="font-semibold text-slate-800">{svg.name}</h2>
              <p className="mt-2 text-2xl font-bold tabular-nums text-blue-600">£{svg.target_amount}</p>
              <p className="mt-1 text-xs text-slate-400">Target date: {svg.target_date}</p>
              <Link to={`/savings-goals/${svg.id}/edit`} className="mr-3 text-blue-600 hover:underline">
                Edit
              </Link>
              <button
              onClick={() => handleDelete(svg.id)}
              className="mt-4 text-sm text-red-600 hover:underline">
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
