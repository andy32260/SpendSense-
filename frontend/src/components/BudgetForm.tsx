import { useEffect, useState } from 'react';
import { getCategories, type Category } from '../api/transactions';
import { monthBounds, parseDate, periodProgress, toISODate, toNumber } from '../lib/format';
import FormLayout from './FormLayout';
import AmountInput from './AmountInput';
import CategoryChips from './CategoryChips';
import BudgetRow from './BudgetRow';

export type BudgetValues = { category: string; amount: string; start_date: string; end_date: string };

type Props = {
    mode: 'create' | 'edit';
    initial?: BudgetValues;
    // Already spent in this budget (edit only), for the preview
    spent?: number;
    onSave: (values: BudgetValues, categoryName: string) => Promise<void>;
};

function thisMonth(): BudgetValues {
    const now = new Date();
    const { start, end } = monthBounds(now.getFullYear(), now.getMonth());
    return { category: '', amount: '', start_date: toISODate(start), end_date: toISODate(end) };
}

export default function BudgetForm({ mode, initial, spent = 0, onSave }: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [values, setValues] = useState<BudgetValues>(initial ?? thisMonth());
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getCategories().then(setCategories);
    }, []);

    const set = (field: keyof BudgetValues) => (value: string) => setValues((v) => ({ ...v, [field]: value }));
    const catName = categories.find((c) => String(c.id) === values.category)?.name ?? '';
    const datesValid = values.start_date && values.end_date && values.start_date <= values.end_date;

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        if (!values.category) return setError('Pick the category this budget is for.');
        if (!(toNumber(values.amount) > 0)) return setError('Add a limit, e.g. 150.');
        if (!datesValid) return setError('Check the dates. The end date needs to be on or after the start date.');

        setSubmitting(true);
        try {
            await onSave(values, catName);
        } catch {
            setError("That budget didn't save. Check your connection and try again. Everything you typed is still here.");
            setSubmitting(false);
        }
    }

    const title = mode === 'create'
        ? catName ? `How much for ${catName.toLowerCase()}?` : 'How much do you want to spend?'
        : `Adjust your ${catName ? catName.toLowerCase() + ' ' : ''}budget`;

    return (
        <FormLayout
            label={mode === 'create' ? 'New budget' : 'Edit budget'}
            title={title}
            intro="Pick a category and a limit. We'll show how much is left as you spend, and flag it when you're getting close."
            preview={
                <BudgetRow
                    name={catName || 'Your budget'}
                    spent={spent}
                    limit={toNumber(values.amount)}
                    startDate={datesValid ? values.start_date : undefined}
                    endDate={datesValid ? values.end_date : undefined}
                    pace={datesValid ? periodProgress(parseDate(values.start_date), parseDate(values.end_date)) : null}
                />
            }
            onSubmit={handleSubmit}
            error={error}
            submitting={submitting}
            submitLabel={mode === 'create' ? 'Create budget' : 'Save changes'}
        >
            <AmountInput id="budget-amount" label="Limit" value={values.amount} onChange={set('amount')} placeholder="150.00" />
            <CategoryChips name="budget-category" legend="Category" options={categories} value={values.category} onChange={set('category')} />
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="field-label" htmlFor="budget-start">
                    Starts
                    <input id="budget-start" type="date" value={values.start_date} onChange={(e) => set('start_date')(e.target.value)} className="field" />
                </label>
                <label className="field-label" htmlFor="budget-end">
                    Ends
                    <input id="budget-end" type="date" value={values.end_date} onChange={(e) => set('end_date')(e.target.value)} className="field" />
                </label>
            </div>
        </FormLayout>
    );
}
