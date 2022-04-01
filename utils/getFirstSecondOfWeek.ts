export function getFirstSecondOfWeek(date: Date): Date {
    const dayOfWeek = date.getUTCDay();
    const dayOfMonth = date.getUTCDate();
    const lastSunday = dayOfMonth - dayOfWeek;
    // Make a copy of date to prevent .setUTCHours() from mutating the input
    const firstSecondOfWeek = new Date(date);
    firstSecondOfWeek.setUTCDate(lastSunday);
    firstSecondOfWeek.setUTCHours(0, 0, 0, 0);
    return firstSecondOfWeek;
}
