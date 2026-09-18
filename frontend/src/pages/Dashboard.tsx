import {useState, useEffect} from 'react'
import { getMonthlySummary, type MonthlySummaryItem, getRecurringTransactions, type RecurringTransactionItem } from '../api/transactions';

export default function Dashboard() {
    const [monthlysummaryitem, setMonthlySummaryItem] = useState<MonthlySummaryItem[]>([]);
    const [recurringtransactionitem, setRecurringTransaction] = useState<RecurringTransactionItem[]>([]);
    

    useEffect(() => {
    async function fetchData() {
        const monthlySummary = await getMonthlySummary(2026, 8);
        setMonthlySummaryItem(monthlySummary);
        const recurringTransaction = await getRecurringTransactions();
        setRecurringTransaction(recurringTransaction);
    }
    fetchData();
    }, []);
    
    return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Monthly Summary</h2>
          {monthlysummaryitem.length === 0 ? (
            <p className="text-sm text-slate-500">No spending to summarise yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {monthlysummaryitem.map((mnnth_sum) => (
                <li key={mnnth_sum.category__name} className="flex items-center justify-between py-3">
                  <span className="text-slate-600">{mnnth_sum.category__name}</span>
                  <span className="font-semibold tabular-nums text-slate-900">£{mnnth_sum.total}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Recurring Transactions</h2>
          {recurringtransactionitem.length === 0 ? (
            <p className="text-sm text-slate-500">No recurring transactions detected yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recurringtransactionitem.map((recurr_tran) => (
                <li key={recurr_tran.key} className="flex items-center justify-between py-3">
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {recurr_tran.occurrences} occurrences
                  </span>
                  <span className="text-slate-500">
                    avg <span className="font-semibold tabular-nums text-slate-900">£{recurr_tran.avg_amount}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
