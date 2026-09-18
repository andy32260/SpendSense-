import {useState, useEffect} from 'react'
import { getSavingsGoals, type SavingsGoals } from '../api/savings';

export default function SavingsGoals() {
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoals[]>([]);

    useEffect(() => {
    async function fetchData() {
        const result = await getSavingsGoals();
        setSavingsGoals(result);
    }
    fetchData();
    }, []);
    
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
