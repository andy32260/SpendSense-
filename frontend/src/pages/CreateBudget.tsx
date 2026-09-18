import {useState, useEffect} from 'react'
import { getCategories, type Category} from '../api/transactions';
import { useNavigate } from 'react-router-dom';
import { createBudget } from '../api/budgets';

export default function CreateBudget() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState('')
    const [amount, setAmount] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    try {
      await createBudget(category, amount, start_date, end_date)
      navigate('/budgets');
    } catch (err) {
      setError('Budget Creation Unsuccessful');
    }
  }

    useEffect(() => {
    async function fetchData() {
        const result = await getCategories();
        setCategories(result);
    }
    fetchData();
    }, []);
    
    return (
    <div>
        <form onSubmit={handleSubmit}>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="£4.99"
          />
          <input
            type="date"
            value={start_date}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="01/01/2026"
          />
          <input
            type="date"
            value={end_date}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="01/01/2027"
          />
          <button type="submit">Create Budget</button>
        </form>
    </div>
  );
}

