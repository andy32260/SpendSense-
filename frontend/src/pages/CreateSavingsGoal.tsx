import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { createSavingsGoal } from '../api/savings';

export default function CreateSavingsGoal() {
    const [name, setName] = useState('')
    const [target_amount, setTargetAmount] = useState('');
    const [target_date, setTargetDate] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    try {
      await createSavingsGoal(name, target_amount, target_date)
      navigate('/savings-goals');
    } catch (err) {
      setError('Savings Goal Creation Unsuccessful');
    }
  }

    return (
    <div className="flex justify-center px-6 py-12">
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4 rounded bg-white p-8 shadow">
          <h1 className="text-xl font-bold text-slate-800">Create Savings Goal</h1>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Target amount
            <input
              type="text"
              value={target_amount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="£4.99"
              className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Target date
            <input
              type="date"
              value={target_date}
              onChange={(e) => setTargetDate(e.target.value)}
              placeholder="01/01/2026"
              className="rounded border border-slate-300 px-3 py-2 font-normal text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="rounded bg-blue-600 py-2 text-white hover:bg-blue-700">Create Savings Goal</button>
        </form>
    </div>
  );
}

