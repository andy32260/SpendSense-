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
    <div className="flex justify-center px-6 py-12">
        <form onSubmit={handleSubmit} className="form-card">
          <h1 className="form-title">Create Budget</h1>
          <label className="field-label">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="field-input"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </label>
          <label className="field-label">
            Amount
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">£</span>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="4.99"
                className="field-input w-full pl-7"
              />
            </div>
          </label>
          <label className="field-label">
            Start date
            <input
              type="date"
              value={start_date}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="01/01/2026"
              className="field-input"
            />
          </label>
          <label className="field-label">
            End date
            <input
              type="date"
              value={end_date}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="01/01/2027"
              className="field-input"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary">Create Budget</button>
        </form>
    </div>
  );
}

