import { useNavigate } from 'react-router-dom';
import { createBudget } from '../api/budgets';
import BudgetForm from '../components/BudgetForm';
import { formatPounds, formatRange } from '../lib/format';

export default function CreateBudget() {
    const navigate = useNavigate();

    return (
        <BudgetForm
            mode="create"
            onSave={async (v, categoryName) => {
                await createBudget(v.category, v.amount, v.start_date, v.end_date);
                navigate('/budgets', {
                    state: { flash: `Budget set: ${formatPounds(v.amount)} for ${categoryName}, ${formatRange(v.start_date, v.end_date)}. We'll flag it when you're getting close.` },
                });
            }}
        />
    );
}
