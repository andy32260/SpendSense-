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
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4 rounded bg-white p-8 shadow">
          <h1 className="text-xl font-bold text-slate-800">Create Budget</h1>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded border border-slate-300 bg-white px-3 py-2 font-normal text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Amount
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="£4.99"
              className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Start date
            <input
              type="date"
              value={start_date}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="01/01/2026"
              className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            End date
            <input
              type="date"
              value={end_date}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="01/01/2027"
              className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="rounded bg-blue-600 py-2 text-white hover:bg-blue-700">Create Budget</button>
        </form>
    </div>
  );
}

