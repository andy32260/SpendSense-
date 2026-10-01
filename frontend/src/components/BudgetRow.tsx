import type { ReactNode } from 'react';
import Money from './Money';
import { budgetStatus, toneStyles } from '../lib/budgetStatus';
import { formatRange } from '../lib/format';

type BudgetRowProps = {
    name: string;
    spent: number;
    limit: number;
    startDate?: string;
    endDate?: string;
    // 0–1, where today falls in the budget period
    pace?: number | null;
    compact?: boolean;
    actions?: ReactNode;
};

export default function BudgetRow({ name, spent, limit, startDate, endDate, pace, compact = false, actions }: BudgetRowProps) {
    const { ratio, tone, left } = budgetStatus(spent, limit);
    const style = toneStyles[tone];
    const fill = Math.min(100, ratio * 100);

    const bar = (
        <div
            className={`track ${compact ? 'h-2' : ''}`}
            role="progressbar"
            aria-label={`${name}: ${Math.round(ratio * 100)}% of budget used`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(fill)}
        >
            <div className={`track-fill ${style.bar}`} style={{ width: `${fill}%` }} />
            {pace != null && pace > 0 && pace < 1 && (
                <span className="pace-marker" style={{ left: `${pace * 100}%` }} title="Where you'd be if you spent evenly" />
            )}
        </div>
    );

    if (compact) {
        return (
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3 text-sm font-bold">
                    <span className="truncate">{name}</span>
                    <span className={`pill ${style.pill}`}>
                        {tone === 'over' ? <>£{Math.abs(left).toFixed(2)} over</> : <>£{left.toFixed(2)} left</>}
                    </span>
                </div>
                {bar}
            </div>
        );
    }

    return (
        <div className="card flex flex-col gap-3 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div className="flex min-w-0 items-center gap-2">
                    <h2 className="truncate text-lg text-ink">{name}</h2>
                    {tone !== 'ok' && <span className={`pill ${style.pill}`}>{style.label}</span>}
                </div>
                <p className={`flex items-baseline gap-1.5 ${style.figure}`}>
                    <Money value={Math.abs(left)} className="text-2xl" />
                    <span className="text-sm text-ink-soft">{tone === 'over' ? 'over' : 'left'}</span>
                </p>
            </div>
            {bar}
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-ink-soft tabular-nums">
                <span>
                    £{spent.toFixed(2)} of £{limit.toFixed(2)}
                    {startDate && endDate && <> · {formatRange(startDate, endDate)}</>}
                </span>
                {actions && <span className="flex gap-4">{actions}</span>}
            </div>
        </div>
    );
}
