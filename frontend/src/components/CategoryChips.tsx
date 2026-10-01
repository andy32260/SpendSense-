type Option = { id: number | string; name: string };

type CategoryChipsProps = {
    name: string;
    legend: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    emptyText?: string;
};

// Tap-to-pick replacement for a <select>: every option visible, one tap
export default function CategoryChips({ name, legend, options, value, onChange, emptyText = 'Loading…' }: CategoryChipsProps) {
    return (
        <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-bold text-ink-soft">{legend}</legend>
            {options.length === 0 ? (
                <p className="text-sm text-ink-soft">{emptyText}</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {options.map((opt) => (
                        <label key={opt.id} className="chip">
                            <input
                                type="radio"
                                name={name}
                                value={String(opt.id)}
                                checked={value === String(opt.id)}
                                onChange={(e) => onChange(e.target.value)}
                                className="sr-only"
                            />
                            {opt.name}
                        </label>
                    ))}
                </div>
            )}
        </fieldset>
    );
}
