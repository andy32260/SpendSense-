import {useState, useEffect} from 'react'
import { getBudgets, deleteBudget, type Budget } from '../api/budgets';
import { Link } from 'react-router-dom';

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
    <div className="page">
      <h1 className="page-title">Budgets</h1>
      {budgets.length === 0 ? (
        <div className="empty-state">
          No budgets yet.
        </div>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2">
          {budgets.map((bdgt) => {
            const limit = Number(bdgt.amount);
            const percent = limit > 0 ? Math.min(100, (bdgt.spent_so_far / limit) * 100) : 0;
            const overBudget = limit > 0 && bdgt.spent_so_far > limit;
            const amountLeft = overBudget ? bdgt.spent_so_far - limit : Math.max(0, limit - bdgt.spent_so_far);
            const tone = overBudget
              ? { card: 'border-terracotta/30 bg-terracotta-tint/40', bar: 'bg-terracotta', figure: 'text-terracotta-ink', chip: 'bg-terracotta-tint text-terracotta-ink', label: 'Over budget' }
              : percent >= 80
              ? { card: 'border-line bg-surface', bar: 'bg-saffron', figure: 'text-saffron-ink', chip: 'bg-saffron-tint text-saffron-ink', label: 'Nearing limit' }
              : { card: 'border-line bg-surface', bar: 'bg-fern', figure: 'text-pine', chip: 'bg-pine-tint text-pine', label: 'On track' };

            return (
              <li key={bdgt.id} className={`card flex flex-col ${tone.card}`}>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-ink-soft">{bdgt.category_name}</h2>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone.chip}`}>{tone.label}</span>
                </div>
                <p className={`figure mt-4 text-5xl ${tone.figure}`}>
                  £{amountLeft.toFixed(2)}
                  <span className="ml-2 font-sans text-base font-medium tracking-normal text-ink-soft">{overBudget ? 'over' : 'left'}</span>
                </p>
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(percent)}
                  className="mt-5 h-3 overflow-hidden rounded-full bg-sunken shadow-[inset_0_1px_2px_rgb(20_35_31/0.14)]"
                >
                  <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${percent}%` }} />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3 text-sm tabular-nums text-ink-soft">
                  <p>
                    <span className="font-semibold text-ink">£{bdgt.spent_so_far}</span>
                    {' '}/ £{bdgt.amount}
                  </p>
                  <p className="text-xs text-ink-muted">{bdgt.start_date} – {bdgt.end_date}</p>
                </div>
                <div className="mt-5 flex gap-4 border-t border-line pt-4">
                  <Link to={`/budgets/${bdgt.id}/edit`} className="link-action">
                    Edit
                  </Link>
                  <button
                  onClick={() => handleDelete(bdgt.id)}
                  className="link-danger">
                  Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
