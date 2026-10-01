import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSavingsGoals, getProjection, type SavingsGoals, type Reduction } from '../api/savings';
import { getCategories, type Category } from '../api/transactions';
import FormLayout from '../components/FormLayout';
import CategoryChips from '../components/CategoryChips';
import Icon from '../components/Icon';

// Display-only: turns the raw month count into readable text
function formatDuration(months: number) {
    const [value, unit] = months > 24 ? [months / 12, 'year'] : [months, 'month'];
    // one decimal below 10, whole numbers above; drop a trailing ".0"
    const rounded = Math.round(value * 10) / 10;
    const shown = rounded < 10 ? rounded : Math.round(value);
    return `${shown.toLocaleString()} ${unit}${shown === 1 ? '' : 's'}`;
}

export default function SavingsProjection() {
    const [goals, setGoals] = useState<SavingsGoals[] | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedGoal, setSelectedGoal] = useState('');
    const [reductions, setReductions] = useState<{ category: string; percentage: string }[]>([
        { category: '', percentage: '' }
    ]);
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const [goalsData, categoriesData] = await Promise.all([getSavingsGoals(), getCategories()]);
            setGoals(goalsData);
            setCategories(categoriesData);
        }
        fetchData();
    }, []);

    function updateReduction(index: number, field: 'category' | 'percentage', value: string) {
        setReductions(reductions.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
        setResult(null);
    }

    function addReduction() {
        setReductions([...reductions, { category: '', percentage: '' }]);
    }

    function removeReduction(index: number) {
        setReductions(reductions.filter((_, i) => i !== index));
        setResult(null);
    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        if (!selectedGoal) return setError('Pick the goal you want to reach sooner.');
        if (reductions.some((r) => !r.category || !(Number(r.percentage) > 0))) {
            return setError('Each cut-back needs a category and a percentage, e.g. Eating out, 20%.');
        }

        setSubmitting(true);
        try {
            const formattedReductions: Reduction[] = reductions.map((r) => ({
                category_id: Number(r.category),
                percentage: Number(r.percentage),
            }));
            setResult(await getProjection(Number(selectedGoal), formattedReductions));
        } catch {
            setError("We couldn't work that out just now. Check your connection and try again.");
        }
        setSubmitting(false);
    }

    const goalName = goals?.find((g) => String(g.id) === selectedGoal)?.name;

    if (goals !== null && goals.length === 0) {
        return (
            <div className="flex flex-col items-start gap-3 rounded-card border-2 border-dashed border-edge-deep bg-surface/60 px-6 py-8">
                <p className="font-display text-xl">Set a goal first</p>
                <p className="max-w-md leading-relaxed text-ink-soft">This page shows how much sooner you'd reach a savings goal if you spent a little less. Add a goal and come back.</p>
                <Link to="/savings-goals/new" className="btn-secondary mt-3">Set a goal</Link>
            </div>
        );
    }

    return (
        <FormLayout
            label="What if…"
            title={goalName ? `How soon could I reach ${goalName}?` : 'What if I spent a bit less?'}
            intro="Pick a goal, then choose where you could cut back and by how much. We'll use your average monthly spending to work out how long it would take."
            previewLabel="Answer"
            preview={
                result === null ? (
                    <div className="rounded-card border-2 border-dashed border-edge-deep px-5 py-6 text-center text-ink-soft">
                        Your answer will appear here.
                    </div>
                ) : (
                    <div className="flex flex-col gap-1 rounded-card border-[1.5px] border-butter-deep bg-butter px-6 py-6 text-butter-ink shadow-ledge-butter" role="status">
                        {result <= 0 ? (
                            <p className="font-display text-3xl">You've already reached this goal. Nice work!</p>
                        ) : (
                            <>
                                <span className="text-sm font-bold">About</span>
                                <span className="font-display text-5xl leading-none tracking-tight wrap-break-word">{formatDuration(result)}</span>
                                <span className="text-sm font-bold">to reach {goalName ?? 'your goal'} at this rate</span>
                            </>
                        )}
                    </div>
                )
            }
            onSubmit={handleSubmit}
            error={error}
            submitting={submitting}
            submitLabel="Work it out"
            secondaryAction={<Link to="/savings-goals" className="btn-secondary">Back to goals</Link>}
        >
            <CategoryChips
                name="projection-goal"
                legend="Goal"
                options={goals ?? []}
                value={selectedGoal}
                onChange={(v) => { setSelectedGoal(v); setResult(null); }}
            />

            <fieldset className="flex flex-col gap-3">
                <legend className="mb-2 text-sm font-bold text-ink-soft">Where could you cut back?</legend>
                {reductions.map((row, index) => (
                    <div key={index} className="flex items-center gap-2 rounded-field bg-sunken/70 p-2">
                        <select
                            value={row.category}
                            onChange={(e) => updateReduction(index, 'category', e.target.value)}
                            className="field min-w-0 flex-1 bg-surface"
                            aria-label={`Category ${index + 1}`}
                        >
                            <option value="">Choose a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <div className="relative w-24 shrink-0">
                            <input
                                type="text"
                                inputMode="decimal"
                                value={row.percentage}
                                onChange={(e) => updateReduction(index, 'percentage', e.target.value.replace(/[^\d.]/g, ''))}
                                placeholder="20"
                                aria-label={`Cut back by (percent) ${index + 1}`}
                                className="field bg-surface pr-8"
                            />
                            <span className="absolute top-1/2 right-4 -translate-y-1/2 text-ink-soft" aria-hidden="true">%</span>
                        </div>
                        {reductions.length > 1 && (
                            <button type="button" onClick={() => removeReduction(index)} className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-ink-soft hover:bg-surface hover:text-danger-ink" aria-label={`Remove category ${index + 1}`}>
                                <Icon name="close" className="size-4" />
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addReduction} className="flex min-h-11 cursor-pointer items-center gap-2 self-start rounded-full border-2 border-dashed border-edge-deep px-4 text-sm font-bold text-ink-soft transition hover:border-plum hover:bg-plum-tint hover:text-plum">
                    <Icon name="plus" className="size-4" /> Add another category
                </button>
            </fieldset>
        </FormLayout>
    );
}
