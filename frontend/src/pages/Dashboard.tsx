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
    <div>
      {
        <ul>
            {monthlysummaryitem.map((mnnth_sum) => (
                <li key={mnnth_sum.category__name}>{mnnth_sum.category__name} - £{mnnth_sum.total}</li>
            ))}
            {recurringtransactionitem.map((recurr_tran) => (
              <li key={recurr_tran.key}>{recurr_tran.occurrences} - £{recurr_tran.avg_amount}</li>
            ))}
        </ul>
      }
    </div>
  );
}
