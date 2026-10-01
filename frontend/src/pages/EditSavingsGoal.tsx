import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editSavingsGoal, getSavingsGoal } from '../api/savings';
import SavingsGoalForm, { type SavingsGoalValues } from '../components/SavingsGoalForm';

export default function EditSavingsGoal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initial, setInitial] = useState<SavingsGoalValues | null>(null);

    useEffect(() => {
        async function fetchData() {
            const result = await getSavingsGoal(id!);
            setInitial({ name: result.name, target_amount: result.target_amount, target_date: result.target_date });
        }
        fetchData();
    }, [id]);

    if (!initial) return <p className="text-ink-soft">Loading…</p>;

    return (
        <SavingsGoalForm
            mode="edit"
            initial={initial}
            onSave={async (v) => {
                await editSavingsGoal(Number(id), v.name, v.target_amount, v.target_date);
                navigate('/savings-goals', { state: { flash: `${v.name} updated.` } });
            }}
        />
    );
}
