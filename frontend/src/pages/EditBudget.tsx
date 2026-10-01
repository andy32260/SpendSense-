import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editBudget, getBudget } from '../api/budgets';
import BudgetForm, { type BudgetValues } from '../components/BudgetForm';
import { toNumber } from '../lib/format';

export default function EditBudget() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initial, setInitial] = useState<BudgetValues | null>(null);
    const [spent, setSpent] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const result = await getBudget(id!);
            setInitial({ category: String(result.category), amount: result.amount, start_date: result.start_date, end_date: result.end_date });
            setSpent(toNumber(result.spent_so_far));
        }
        fetchData();
    }, [id]);

    if (!initial) return <p className="text-ink-soft">Loading…</p>;

    return (
        <BudgetForm
            mode="edit"
            initial={initial}
            spent={spent}
            onSave={async (v, categoryName) => {
                await editBudget(Number(id), v.category, v.amount, v.start_date, v.end_date);
                navigate('/budgets', { state: { flash: `${categoryName || 'Budget'} updated.` } });
            }}
        />
    );
}
