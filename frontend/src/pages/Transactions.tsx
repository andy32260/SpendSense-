import {useState, useEffect} from 'react'
import { getTransactions, deleteTransaction, type Transaction } from '../api/transactions';
import { Link } from 'react-router-dom';

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
    async function fetchData() {
        const result = await getTransactions();
        setTransactions(result);
    }
    fetchData();
    }, []);

    async function handleDelete(id: number) {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((txn) => txn.id !== id));
    }
    
    return (
    <div className="page">
      <h1 className="page-title">Transactions</h1>
      {transactions.length === 0 ? (
        <div className="empty-state">
          No transactions yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
              <tr className="border-b border-ink/15">
                <th className="py-3 pr-4 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 text-right font-semibold">Amount</th>
                <th className="py-3 pl-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {transactions.map((txn) => (
                <tr key={txn.id} className="transition hover:bg-sunken/60">
                  <td className="py-4 pr-4 font-medium text-ink">{txn.description}</td>
                  <td className="px-4 py-4 text-sm tabular-nums text-ink-soft">{txn.date}</td>
                  <td className="px-4 py-4 text-right text-lg font-semibold tabular-nums text-ink">£{txn.amount}</td>
                  <td className="whitespace-nowrap py-4 pl-4 text-right">
                    <Link to={`/transactions/${txn.id}/edit`} className="link-action mr-4">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(txn.id)} className="link-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
