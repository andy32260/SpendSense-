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
    <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <input
            type="text"
            value={target_amount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="£4.99"
          />
          <input
            type="date"
            value={target_date}
            onChange={(e) => setTargetDate(e.target.value)}
            placeholder="01/01/2026"
          />
          <button type="submit">Create Savings Goal</button>
        </form>
    </div>
  );
}

