import { useParams } from 'react-router-dom';
import {useState, useEffect} from 'react'
import { editTransaction, getTransaction, getCategories, type Category } from '../api/transactions';
import { useNavigate } from 'react-router-dom';

export default function EditTransaction() {
    const { id } = useParams();
    const [category, setCategory] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function fetchData() {
            const result = await getTransaction(id!);
            setCategory(String(result.category))
            setAmount(result.amount)
            setDescription(result.description)
            setDate(result.date)
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
            await editTransaction(Number(id), category, amount, description, date)
            navigate(`/transactions`);
        } catch (err) {
            setError('Transaction Change Unsuccessful');
        }   
    }


    return (
    <div className="flex justify-center px-6 py-12">
        <form onSubmit={handleSubmit} className="form-card">
        <h1 className="form-title">Edit Transaction</h1>
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
            Description
            <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="field-input"
            />
        </label>
        <label className="field-label">
            Date
            <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="field-input"
            />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn-primary">
            Save Changes
        </button>
        </form>
    </div>
    );
}