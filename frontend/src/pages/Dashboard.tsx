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
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <section className="card border-line bg-surface lg:col-span-3">
          <h2 className="mb-2 text-xl font-semibold text-ink">Monthly Summary</h2>
          {monthlysummaryitem.length === 0 ? (
            <p className="empty-state mt-4">No spending to summarise yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {monthlysummaryitem.map((mnnth_sum) => (
                <li key={mnnth_sum.category__name} className="flex items-baseline justify-between py-4">
                  <span className="font-medium text-ink-soft">{mnnth_sum.category__name}</span>
                  <span className="figure text-2xl text-ink">£{mnnth_sum.total}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="card border-pine-deep bg-pine text-pine-tint lg:col-span-2">
          <h2 className="mb-2 text-xl font-semibold text-surface">Recurring Transactions</h2>
          {recurringtransactionitem.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-white/25 px-6 py-10 text-center text-sm text-pine-tint/80">
              No recurring transactions detected yet.
            </p>
          ) : (
            <ul className="divide-y divide-white/15">
              {recurringtransactionitem.map((recurr_tran) => (
                <li key={recurr_tran.key} className="flex flex-col gap-2 py-4">
                  <span className="w-fit rounded-full bg-white/12 px-2.5 py-0.5 text-xs font-medium text-mint">
                    {recurr_tran.occurrences} occurrences
                  </span>
                  <span className="text-sm text-pine-tint/80">
                    avg <span className="figure ml-1 text-3xl text-surface">£{recurr_tran.avg_amount}</span>
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
