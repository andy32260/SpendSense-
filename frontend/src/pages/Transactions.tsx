import {useState, useEffect} from 'react'
import { getTransactions, type Transaction } from '../api/transactions';

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
    async function fetchData() {
        const result = await getTransactions();
        setTransactions(result);
    }
    fetchData();
    }, []);
    
    return (
    <div>
      {
        <ul>
            {transactions.map((txn) => (
                <li key={txn.id}>{txn.description} - £{txn.amount}</li>
            ))}
        </ul>
      }
    </div>
  );
}
