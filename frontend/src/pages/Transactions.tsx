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
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Transactions</h1>
      {transactions.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center text-sm text-slate-500 shadow">
          No transactions yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 text-right font-medium">Amount</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-800">{txn.description}</td>
                  <td className="px-6 py-4 text-slate-500">{txn.date}</td>
                  <td className="px-6 py-4 text-right font-semibold tabular-nums text-slate-900">£{txn.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/transactions/${txn.id}/edit`} className="mr-3 text-blue-600 hover:underline">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(txn.id)} className="text-red-600 hover:underline">
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
