// Literal class strings so Tailwind can see them
const swatches = [
    { bar: 'bg-cat-1', badge: 'bg-cat-1-tint text-cat-1' },
    { bar: 'bg-cat-2', badge: 'bg-cat-2-tint text-cat-2-ink' },
    { bar: 'bg-cat-3', badge: 'bg-cat-3-tint text-cat-3-ink' },
    { bar: 'bg-cat-4', badge: 'bg-cat-4-tint text-cat-4-ink' },
    { bar: 'bg-cat-5', badge: 'bg-cat-5-tint text-cat-5-ink' },
    { bar: 'bg-cat-6', badge: 'bg-cat-6-tint text-cat-6-ink' },
];

// Stable colour per category name
export function categoryColor(name: string) {
    let hash = 0;
    for (const ch of name.toLowerCase()) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    return swatches[hash % swatches.length];
}

export function categoryColorByIndex(index: number) {
    return swatches[index % swatches.length];
}
