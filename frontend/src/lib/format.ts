// Shared display helpers: money, dates, and "where are we in this period".

const DAY_MS = 24 * 60 * 60 * 1000;

export function toNumber(value: string | number | null | undefined): number {
    const n = typeof value === 'number' ? value : parseFloat(value ?? '');
    return Number.isFinite(n) ? n : 0;
}

export function formatPounds(value: string | number): string {
    return `£${toNumber(value).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Parse a "YYYY-MM-DD" string as a local date (not UTC midnight)
export function parseDate(iso: string): Date {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
}

export function toISODate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

export function startOfToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function monthBounds(year: number, monthIndex: number) {
    return { start: new Date(year, monthIndex, 1), end: new Date(year, monthIndex + 1, 0) };
}

export function formatShortDate(iso: string): string {
    return parseDate(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function formatLongDate(iso: string): string {
    return parseDate(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatRange(startIso: string, endIso: string): string {
    return `${formatShortDate(startIso)} – ${formatShortDate(endIso)}`;
}

// "Today", "Yesterday", or "Mon 28 Sep"
export function dayLabel(iso: string): string {
    const diff = Math.round((startOfToday().getTime() - parseDate(iso).getTime()) / DAY_MS);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return parseDate(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function daysUntil(iso: string): number {
    return Math.round((parseDate(iso).getTime() - startOfToday().getTime()) / DAY_MS);
}

// How far through a period today is, from 0 (not started) to 1 (finished)
export function periodProgress(start: Date, end: Date, today = startOfToday()): number {
    const total = end.getTime() - start.getTime() + DAY_MS;
    const elapsed = today.getTime() - start.getTime() + DAY_MS;
    return Math.min(1, Math.max(0, elapsed / total));
}

// How much to put aside each week to reach a target by its date
export function weeklyAmount(target: number, targetIso: string): number | null {
    const days = daysUntil(targetIso);
    if (days <= 0) return null;
    return target / Math.max(1, days / 7);
}

export function capitalise(text: string): string {
    return text.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

export function greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}
