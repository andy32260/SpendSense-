import {useState, useEffect} from 'react'
import { getBudgets, type Budget } from '../api/budgets';

export default function Budgets() {
    const [budgets, setBudgets] = useState<Budget[]>([]);

    useEffect(() => {
    async function fetchData() {
        const result = await getBudgets();
        setBudgets(result);
    }
    fetchData();
    }, []);
    
    return (
    <div>
      {
        <ul>
            {budgets.map((bdgt) => (
                <li key={bdgt.id}>{bdgt.category_name} - £{bdgt.spent_so_far} / £{bdgt.amount}</li>
            ))}
        </ul>
      }
    </div>
  );
}
