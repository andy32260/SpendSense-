import { useParams } from 'react-router-dom';
import {useState, useEffect} from 'react'
import { editBudget, getBudget, type Budget } from '../api/budgets';
import { useNavigate } from 'react-router-dom';
import { getCategories, type Category } from '../api/transactions';

export default function EditBudget() {
    const { id } = useParams();
    const [category, setCategory] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [start_date, setStartDate] = useState<string>('')
    const [end_date, setEndDate] = useState<string>('')
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function fetchData() {
            const result = await getBudget(id!);
            setCategory(String(result.category))
            setAmount(result.amount)
            setStartDate(result.start_date)
            setEndDate(result.end_date)
        }
        fetchData()
    }, [])


    useEffect(() => {
    async function fetchCategories() {
        const result = await getCategories();
        setCategories(result);
    }
    fetchCategories();
    }, []);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
    
        try {
            await editBudget(Number(id), category, amount, start_date, end_date)
            navigate(`/budgets`);
        } catch (err) {
            setError('Budget Change Unsuccessful');
        }   
    }

    return (
    <div className="flex justify-center px-6 py-12">
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4 rounded bg-white p-8 shadow">
        <h1 className="text-xl font-bold text-slate-800">Edit Budget</h1>
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
            className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Start Date
            <input
            type="date"
            value={start_date}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            End Date
            <input
            type="date"
            value={end_date}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="rounded bg-blue-600 py-2 text-white hover:bg-blue-700">
            Save Changes
        </button>
        </form>
    </div>
    );
}