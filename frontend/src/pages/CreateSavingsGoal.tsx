import { useNavigate } from 'react-router-dom';
import { createSavingsGoal } from '../api/savings';
import SavingsGoalForm from '../components/SavingsGoalForm';
import { formatLongDate, toNumber, weeklyAmount } from '../lib/format';

export default function CreateSavingsGoal() {
    const navigate = useNavigate();

    return (
        <SavingsGoalForm
            mode="create"
            onSave={async (v) => {
                await createSavingsGoal(v.name, v.target_amount, v.target_date);
                const weekly = weeklyAmount(toNumber(v.target_amount), v.target_date);
                const flash = weekly !== null
                    ? `${v.name} is on the board. £${weekly.toFixed(2)} a week gets you there by ${formatLongDate(v.target_date)}.`
                    : `${v.name} is on the board.`;
                navigate('/savings-goals', { state: { flash } });
            }}
        />
    );
}
