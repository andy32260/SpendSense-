import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type EmptyStateProps = {
    title: string;
    children: ReactNode;
    action?: { to: string; label: string };
    className?: string;
};

export default function EmptyState({ title, children, action, className = '' }: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-start gap-2 rounded-card border-2 border-dashed border-edge-deep bg-surface/60 px-6 py-8 ${className}`}>
            <p className="font-display text-xl font-medium text-ink">{title}</p>
            <p className="max-w-md leading-relaxed text-ink-soft">{children}</p>
            {action && (
                <Link to={action.to} className="btn-secondary mt-3">
                    {action.label}
                </Link>
            )}
        </div>
    );
}
