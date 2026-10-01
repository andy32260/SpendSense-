import { useState } from 'react';
import { daysUntil, formatLongDate, toNumber, weeklyAmount } from '../lib/format';
import FormLayout from './FormLayout';
import AmountInput from './AmountInput';
import Money from './Money';

export type SavingsGoalValues = { name: string; target_amount: string; target_date: string };

type Props = {
    mode: 'create' | 'edit';
    initial?: SavingsGoalValues;
    onSave: (values: SavingsGoalValues) => Promise<void>;
};

export default function SavingsGoalForm({ mode, initial, onSave }: Props) {
    const [values, setValues] = useState<SavingsGoalValues>(initial ?? { name: '', target_amount: '', target_date: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const set = (field: keyof SavingsGoalValues) => (value: string) => setValues((v) => ({ ...v, [field]: value }));
    const days = values.target_date ? daysUntil(values.target_date) : null;
    const weekly = values.target_date ? weeklyAmount(toNumber(values.target_amount), values.target_date) : null;

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        if (!values.name.trim()) return setError('Give your goal a name, e.g. "Summer festival".');
        if (!(toNumber(values.target_amount) > 0)) return setError('Add how much you want to save, e.g. 250.');
        if (!values.target_date) return setError('Pick a date you want to reach it by.');

        setSubmitting(true);
        try {
            await onSave(values);
        } catch {
            setError("That goal didn't save. Check your connection and try again. Everything you typed is still here.");
            setSubmitting(false);
        }
    }

    return (
        <FormLayout
            label={mode === 'create' ? 'New savings goal' : 'Edit savings goal'}
            title={mode === 'create' ? 'What are you saving for?' : `Adjust ${values.name || 'your goal'}`}
            intro="Give it a name, a target and a date. We'll work out how much to put aside each week. Small, regular amounts add up faster than you'd think."
            preview={
                <div className="flex items-center justify-between gap-4 rounded-card border-[1.5px] border-edge bg-surface p-4 shadow-ledge">
                    <div className="min-w-0">
                        <p className="truncate font-display text-lg">{values.name || 'Your goal'}</p>
                        <p className="text-sm text-ink-soft">{values.target_date ? `by ${formatLongDate(values.target_date)}` : 'No date yet'}</p>
                    </div>
                    <div className="text-right">
                        <Money value={values.target_amount || 0} className="text-2xl" />
                        <p className="text-sm text-plum tabular-nums">
                            {days !== null && days > 0 && weekly !== null ? `£${weekly.toFixed(2)} a week · ${days} days` : '—'}
                        </p>
                    </div>
                </div>
            }
            onSubmit={handleSubmit}
            error={error}
            submitting={submitting}
            submitLabel={mode === 'create' ? 'Create goal' : 'Save changes'}
        >
            <label className="field-label" htmlFor="goal-name">
                Name
                <input id="goal-name" type="text" value={values.name} onChange={(e) => set('name')(e.target.value)} placeholder="e.g. Summer festival" className="field text-lg" />
            </label>
            <AmountInput id="goal-amount" label="Target" value={values.target_amount} onChange={set('target_amount')} placeholder="250.00" />
            <label className="field-label sm:max-w-60" htmlFor="goal-date">
                Reach it by
                <input id="goal-date" type="date" value={values.target_date} onChange={(e) => set('target_date')(e.target.value)} className="field" />
            </label>
        </FormLayout>
    );
}
