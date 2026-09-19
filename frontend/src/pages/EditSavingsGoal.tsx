import { useParams } from 'react-router-dom';
import {useState, useEffect} from 'react'
import { editSavingsGoal, getSavingsGoal, type SavingsGoals } from '../api/savings';
import { useNavigate } from 'react-router-dom';

export default function EditSavingsGoal() {
    const { id } = useParams();
    const [name, setName] = useState<string>('')
    const [target_amount, setTargetAmount] = useState<string>('')
    const [target_date, setTargetDate] = useState<string>('')
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const result = await getSavingsGoal(id!);
            setName(String(result.name))
            setTargetAmount(result.target_amount)
            setTargetDate(result.target_date)
        }
        fetchData()
    }, [])

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
    
        try {
            await editSavingsGoal(Number(id), name, target_amount, target_date)
            navigate(`/savings-goals`);
        } catch (err) {
            setError('Savings Goal Change Unsuccessful');
        }   
    }


return (
  <div className="flex justify-center px-6 py-12">
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4 rounded bg-white p-8 shadow">
      <h1 className="text-xl font-bold text-slate-800">Edit Savings Goal</h1>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Target Amount
        <input
          type="text"
          value={target_amount}
          onChange={(e) => setTargetAmount(e.target.value)}
          className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Target Date
        <input
          type="date"
          value={target_date}
          onChange={(e) => setTargetDate(e.target.value)}
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