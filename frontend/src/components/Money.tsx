import { toNumber } from '../lib/format';

type MoneyProps = {
    value: string | number;
    className?: string;
    // Hide the pence entirely (e.g. round targets like £250)
    wholePounds?: boolean;
};

// Pounds in the display face, pence half-size and raised: £257⁸²
export default function Money({ value, className = '', wholePounds = false }: MoneyProps) {
    const amount = toNumber(value);
    const negative = amount < 0;
    const [pounds, pence] = Math.abs(amount).toFixed(2).split('.');
    const grouped = Number(pounds).toLocaleString('en-GB');

    return (
        <span className={`money ${className}`} aria-label={`${negative ? 'minus ' : ''}£${grouped}.${pence}`}>
            <span aria-hidden="true">
                {negative && '−'}£{grouped}
                {!(wholePounds && pence === '00') && <span className="pence">.{pence}</span>}
            </span>
        </span>
    );
}
