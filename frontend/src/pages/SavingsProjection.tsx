import { useState, useEffect } from 'react';
import { getSavingsGoals, getProjection, type SavingsGoals, type Reduction } from '../api/savings';
import { getCategories, type Category } from '../api/transactions';

// Display-only: turns the raw month count into readable text
function formatDuration(months: number) {
    const [value, unit] = months > 24 ? [months / 12, 'year'] : [months, 'month'];
    // one decimal below 10, whole numbers above; drop a trailing ".0"
    const rounded = Math.round(value * 10) / 10;
    const shown = rounded < 10 ? rounded : Math.round(value);
    return `${shown.toLocaleString()} ${unit}${shown === 1 ? '' : 's'}`;
}

export default function SavingsProjection() {
    const [goals, setGoals] = useState<SavingsGoals[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedGoal, setSelectedGoal] = useState('');
    const [reductions, setReductions] = useState<{ category: string; percentage: string }[]>([
        { category: '', percentage: '' }
    ]);
    const [result, setResult] = useState<number | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchGoals() {
            const goalsData = await getSavingsGoals();
            setGoals(goalsData);
        }
        fetchGoals();
    }, []);

    useEffect(() => {
        async function fetchCategories() {
            const categoriesData = await getCategories();
            setCategories(categoriesData);
        }
        fetchCategories();
    }, []);

    function updateReduction(index: number, field: 'category' | 'percentage', value: string) {
        const updated = reductions.map((row, i) =>
            i === index ? { ...row, [field]: value } : row
    );
    setReductions(updated);
    }

    function addReduction() {
        setReductions([...reductions, { category: '', percentage: '' }]);
    }
    
    function removeReduction(index: number) {
        const updated = reductions.filter((row, i) => i !== index);
        setReductions(updated);
    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    try {
        const formattedReductions: Reduction[] = reductions.map((r) => ({
            category_id: Number(r.category),
            percentage: Number(r.percentage),
        }));

        const projection = await getProjection(Number(selectedGoal), formattedReductions);
        setResult(projection);
    } catch (err) {
        setError('Could not calculate projection');
    }
}

    return (
        <div className="flex justify-center px-6 py-12">
            <form onSubmit={handleSubmit} className="form-card">
                <label className="field-label">
                    Selected Goal
                    <select value={selectedGoal}
                    onChange={(e) => setSelectedGoal(e.target.value)}
                    className="field-input"
                    >
                        <option value="">Select a goal</option>
                        {goals.map((gls) => (
                            <option key={gls.id} value={gls.id}>{gls.name}</option>
                        ))}
                    </select>
                </label>
                {reductions.map((row, index) => (
                    <div key={index} className="flex items-center gap-2 rounded-2xl border border-line bg-paper/60 p-2">
                        <select
                            value={row.category}
                            onChange={(e) => updateReduction(index, 'category', e.target.value)}
                            className="field-input min-w-0 flex-1"
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <div className="relative w-20 shrink-0">
                            <input
                                type="text"
                                value={row.percentage}
                                onChange={(e) => updateReduction(index, 'percentage', e.target.value)}
                                placeholder="20"
                                className="field-input w-full pr-7"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted">%</span>
                        </div>
                        <button type="button" onClick={() => removeReduction(index)} className="link-danger shrink-0 px-1.5">Remove</button>
                    </div>
                ))}
                <button type="submit" className="btn-primary order-3">Calculate Projection</button>
                {error && <p className="form-error order-2">{error}</p>}
                {result !== null && (
                    <div className="order-4 mt-1 flex h-auto flex-col items-center gap-1 rounded-3xl border border-pine-deep bg-pine px-6 py-7 text-center text-pine-tint">
                        {result <= 0 ? (
                            <p className="figure text-3xl text-surface">You've already reached this goal</p>
                        ) : (
                            <>
                                <p className="text-sm font-medium">Approximately</p>
                                <p className="figure max-w-full wrap-break-word text-4xl text-surface sm:text-5xl">{formatDuration(result)}</p>
                                <p className="text-sm font-medium">to reach your goal at this rate</p>
                            </>
                        )}
                    </div>
                )}
                <button type="button" onClick={addReduction} className="order-1 self-start rounded-xl border border-dashed border-line px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:border-pine hover:bg-pine-tint/50 hover:text-pine">Add reduction</button>
            </form>

        </div>
    )





}