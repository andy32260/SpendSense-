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
    <form onSubmit={handleSubmit} className="form-card">
      <h1 className="form-title">Edit Savings Goal</h1>
      <label className="field-label">
        Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="field-input"
        />
      </label>
      <label className="field-label">
        Target Amount
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
        Target Date
        <input
          type="date"
          value={target_date}
          onChange={(e) => setTargetDate(e.target.value)}
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