import {useState, useEffect} from 'react'
import { getCategories, type Category} from '../api/transactions';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

export default function CreateTransaction() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState('')
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    try {
      await apiClient.post('transactions/', { category, amount, description, date });
      navigate('/transactions');
    } catch (err) {
      setError('Transaction unsuccessful');
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
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="01/01/2026"
          />
          <button type="submit">Create Transaction</button>
        </form>
    </div>
  );
}

