export function formatDate(date: Date): string {
    return date.toISOString().split('.')[0] + 'Z';
}
