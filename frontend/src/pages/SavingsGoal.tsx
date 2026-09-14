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
    <div>
      {
        <ul>
            {savingsGoals.map((svg) => (
                <li key={svg.id}>{svg.name} - £{svg.target_amount}</li>
            ))}
        </ul>
      }
    </div>
  );
}
