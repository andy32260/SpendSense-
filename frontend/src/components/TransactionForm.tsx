import { useEffect, useState } from 'react';
import { getCategories, type Category } from '../api/transactions';
import { categoryColor } from '../lib/categoryColors';
import { dayLabel, toISODate, toNumber } from '../lib/format';
import FormLayout from './FormLayout';
import AmountInput from './AmountInput';
import CategoryChips from './CategoryChips';
import Money from './Money';

export type TransactionValues = { category: string; amount: string; description: string; date: string };

type Props = {
    mode: 'create' | 'edit';
    initial?: TransactionValues;
    onSave: (values: TransactionValues, categoryName: string) => Promise<void>;
};

export default function TransactionForm({ mode, initial, onSave }: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [values, setValues] = useState<TransactionValues>(
        initial ?? { category: '', amount: '', description: '', date: toISODate(new Date()) },
    );
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const set = (field: keyof TransactionValues) => (value: string) => setValues((v) => ({ ...v, [field]: value }));
    const catName = categories.find((c) => String(c.id) === values.category)?.name ?? '';

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        if (!(toNumber(values.amount) > 0)) return setError('Add how much you spent, e.g. 4.99.');
        if (!values.category) return setError('Pick a category so we know where to count it.');
        if (!values.date) return setError('Add the date you spent it.');

        setSubmitting(true);
        try {
            await onSave(values, catName);
        } catch {
            setError("That didn't save. Check your connection and try again. Everything you typed is still here.");
            setSubmitting(false);
        }
    }

    return (
        <FormLayout
            label={mode === 'create' ? 'Log spending' : 'Edit transaction'}
            title={mode === 'create' ? 'What did you spend?' : 'Fix the details'}
            intro={mode === 'create'
                ? 'Every entry, even a small one, makes your budgets and summary more accurate.'
                : 'Change anything that was logged wrong. Your budgets update straight away.'}
            preview={
                <div className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-4 rounded-field border-[1.5px] border-edge bg-surface px-4 py-3">
                    <span className={`grid size-10 place-items-center rounded-field font-display ${categoryColor(catName || '?').badge}`} aria-hidden="true">
                        {(catName || '?').charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate font-bold">{values.description || catName || 'New transaction'}</span>
                        <span className="block text-sm text-ink-soft">{catName || 'No category yet'} · {values.date ? dayLabel(values.date) : 'No date'}</span>
                    </span>
                    <Money value={values.amount || 0} className="text-xl" />
                </div>
            }
            onSubmit={handleSubmit}
            error={error}
            submitting={submitting}
            submitLabel={mode === 'create' ? 'Add transaction' : 'Save changes'}
        >
            <AmountInput id="txn-amount" label="Amount" value={values.amount} onChange={set('amount')} />
            <CategoryChips name="txn-category" legend="Category" options={categories} value={values.category} onChange={set('category')} />
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
                <label className="field-label" htmlFor="txn-description">
                    What was it?
                    <input id="txn-description" type="text" value={values.description} onChange={(e) => set('description')(e.target.value)} placeholder="e.g. Lunch with friends" className="field" />
                </label>
                <label className="field-label" htmlFor="txn-date">
                    Date
                    <input id="txn-date" type="date" value={values.date} onChange={(e) => set('date')(e.target.value)} className="field" />
                </label>
            </div>
        </FormLayout>
    );
}
