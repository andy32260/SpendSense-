import type { ReactNode } from 'react';

type PageHeaderProps = {
    label: string;
    // The page's key number or headline
    headline: ReactNode;
    // Short line next to the headline, e.g. "left of £900 this month"
    kicker?: ReactNode;
    actions?: ReactNode;
    // Filter chips, status pills, etc.
    children?: ReactNode;
};

export default function PageHeader({ label, headline, kicker, actions, children }: PageHeaderProps) {
    return (
        <header className="mb-8 flex flex-col gap-5 sm:mb-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex min-w-0 flex-col gap-3">
                    <h1 className="label-caps font-sans">{label}</h1>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">{headline}</span>
                        {kicker && <span className="text-ink-soft">{kicker}</span>}
                    </div>
                </div>
                {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
            </div>
            {children}
        </header>
    );
}
