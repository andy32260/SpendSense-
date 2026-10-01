import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editTransaction, getTransaction } from '../api/transactions';
import TransactionForm, { type TransactionValues } from '../components/TransactionForm';

export default function EditTransaction() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initial, setInitial] = useState<TransactionValues | null>(null);

    useEffect(() => {
        async function fetchData() {
            const result = await getTransaction(id!);
            setInitial({ category: String(result.category), amount: result.amount, description: result.description, date: result.date });
        }
        fetchData();
    }, [id]);

    if (!initial) return <p className="text-ink-soft">Loading…</p>;

    return (
        <TransactionForm
            mode="edit"
            initial={initial}
            onSave={async (v) => {
                await editTransaction(Number(id), v.category, v.amount, v.description, v.date);
                navigate('/transactions', { state: { flash: 'Transaction updated.' } });
            }}
        />
    );
}
