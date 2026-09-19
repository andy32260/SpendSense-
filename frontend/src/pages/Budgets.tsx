import {useState, useEffect} from 'react'
import { getBudgets, deleteBudget, type Budget } from '../api/budgets';

export default function Budgets() {
    const [budgets, setBudgets] = useState<Budget[]>([]);

    useEffect(() => {
    async function fetchData() {
        const result = await getBudgets();
        setBudgets(result);
    }
    fetchData();
    }, []);

      async function handleDelete(id: number) {
        await deleteBudget(id);
        setBudgets((prev) => prev.filter((bdgt) => bdgt.id !== id));
      }
      
    
    return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Budgets</h1>
      {budgets.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center text-sm text-slate-500 shadow">
          No budgets yet.
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {budgets.map((bdgt) => {
            const limit = Number(bdgt.amount);
            const percent = limit > 0 ? Math.min(100, (bdgt.spent_so_far / limit) * 100) : 0;
            const overBudget = limit > 0 && bdgt.spent_so_far > limit;
            const barColor = overBudget ? 'bg-red-500' : percent >= 80 ? 'bg-amber-500' : 'bg-blue-600';

            return (
              <li key={bdgt.id} className="rounded-lg bg-white p-6 shadow">
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 className="font-semibold text-slate-800">{bdgt.category_name}</h2>
                  <p className="text-sm tabular-nums text-slate-500">
                    <span className={`font-semibold ${overBudget ? 'text-red-600' : 'text-slate-900'}`}>£{bdgt.spent_so_far}</span>
                    {' '}/ £{bdgt.amount}
                  </p>
                </div>
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(percent)}
                  className="h-2 overflow-hidden rounded-full bg-slate-200"
                >
                  <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-400">{bdgt.start_date} – {bdgt.end_date}</p>
                <button
                onClick={() => handleDelete(bdgt.id)}
                className="mt-3 text-sm text-red-600 hover:underline">
                Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
