import { useNavigate } from 'react-router-dom';
import { createTransaction } from '../api/transactions';
import TransactionForm from '../components/TransactionForm';
import { formatPounds } from '../lib/format';

export default function CreateTransaction() {
    const navigate = useNavigate();

    return (
        <TransactionForm
            mode="create"
            onSave={async (v, categoryName) => {
                await createTransaction(v.category, v.amount, v.description, v.date);
                navigate('/transactions', { state: { flash: `Logged ${formatPounds(v.amount)} on ${categoryName}.` } });
            }}
        />
    );
}
