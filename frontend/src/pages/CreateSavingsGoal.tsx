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
        <form onSubmit={handleSubmit} className="form-card">
          <h1 className="form-title">Create Savings Goal</h1>
          <label className="field-label">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="field-input"
            />
          </label>
          <label className="field-label">
            Target amount
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted">£</span>
              <input
                type="text"
                value={target_amount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="4.99"
                className="field-input w-full pl-7"
              />
            </div>
          </label>
          <label className="field-label">
            Target date
            <input
              type="date"
              value={target_date}
              onChange={(e) => setTargetDate(e.target.value)}
              placeholder="01/01/2026"
              className="field-input"
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary">Create Savings Goal</button>
        </form>
    </div>
  );
}

