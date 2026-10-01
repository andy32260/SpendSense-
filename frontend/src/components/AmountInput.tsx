type AmountInputProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

// The hero field on money forms: big display figures on a plum underline
export default function AmountInput({ id, label, value, onChange, placeholder = '0.00' }: AmountInputProps) {
    return (
        <div className="field-label">
            <label htmlFor={id}>{label}</label>
            <div className="flex items-baseline gap-1 border-b-[3px] border-plum pb-1 transition focus-within:border-plum-deep focus-within:shadow-[0_3px_0_var(--color-plum-tint)]">
                <span className="font-display text-3xl text-ink-soft" aria-hidden="true">£</span>
                <input
                    id={id}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    value={value}
                    onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
                    placeholder={placeholder}
                    className="w-full min-w-0 bg-transparent font-display text-5xl font-medium tracking-tight text-ink tabular-nums outline-none placeholder:text-edge-deep sm:text-6xl"
                    style={{ outline: 'none' }}
                />
            </div>
        </div>
    );
}
