const paths = {
    home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
    list: 'M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01',
    budget: 'M21 12a9 9 0 1 1-9-9v9zM15 3.5A9 9 0 0 1 20.5 9H15z',
    goal: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01',
    whatif: 'M3 17l6-6 4 4 8-8M15 7h6v6',
    plus: 'M12 5v14M5 12h14',
    logout: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l-5-5 5-5M5 12h12',
    close: 'M6 6l12 12M18 6 6 18',
    check: 'M5 12.5l4.5 4.5L19 7',
} as const;

export type IconName = keyof typeof paths;

export default function Icon({ name, className = 'size-5' }: { name: IconName; className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
            <path d={paths[name]} />
        </svg>
    );
}
