import type { FormEventHandler, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

type FormLayoutProps = {
    label: string;
    title: ReactNode;
    intro: ReactNode;
    // Live preview of what's being created, shown at the foot of the context pane
    preview?: ReactNode;
    previewLabel?: string;
    onSubmit: FormEventHandler<HTMLFormElement>;
    error?: string;
    submitLabel: string;
    submitting?: boolean;
    // Replace the default Cancel button
    secondaryAction?: ReactNode;
    children: ReactNode;
};

// Two panes: context + live preview on the left, fields on the right
export default function FormLayout({
    label, title, intro, preview, previewLabel = 'Preview', onSubmit, error, submitLabel, submitting = false, secondaryAction, children,
}: FormLayoutProps) {
    const navigate = useNavigate();

    return (
        <div className="grid overflow-hidden rounded-card border-[1.5px] border-edge bg-surface shadow-ledge lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <div className="flex flex-col gap-4 border-b-[1.5px] border-edge bg-plum-tint p-6 sm:p-8 lg:border-r-[1.5px] lg:border-b-0 lg:p-10">
                <span className="label-caps text-plum">{label}</span>
                <h1 className="text-3xl leading-tight tracking-tight text-ink sm:text-4xl">{title}</h1>
                <p className="max-w-md leading-relaxed text-ink-soft">{intro}</p>
                {preview && (
                    <div className="mt-2 flex flex-col gap-3 lg:mt-auto lg:pt-8">
                        <span className="label-caps">{previewLabel}</span>
                        {preview}
                    </div>
                )}
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10" noValidate>
                {children}
                {error && <p className="form-error" role="alert">{error}</p>}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t-[1.5px] border-dashed border-edge pt-6">
                    {secondaryAction ?? (
                        <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
                            Cancel
                        </button>
                    )}
                    <button type="submit" className="btn-primary" disabled={submitting}>
                        {submitting ? 'Saving…' : submitLabel}
                    </button>
                </div>
            </form>
        </div>
    );
}
