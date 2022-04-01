import { getFirstSecondOfWeek } from './getFirstSecondOfWeek';

const previousWeekFirstSecond = '2020-03-08T00:00:00Z';
const previousWeekLastSecond = '2020-03-14T23:59:59Z';
const weekFirstSecond = '2020-03-15T00:00:00Z';
const weekLastSecond = '2020-03-21T23:59:59Z';
const nextWeekFirstSecond = '2020-03-22T00:00:00Z';

describe('getFirstSecondOfWeek', () => {
    it('should turn the last second of the previous week into the first second of the previous week', () => {
        turnsInto(previousWeekLastSecond, previousWeekFirstSecond);
    });
    it('should not modify the first second of the week', () => {
        turnsInto(weekFirstSecond, weekFirstSecond);
    });
    it('should turn the last second of the week into the first second of the week', () => {
        turnsInto(weekLastSecond, weekFirstSecond);
    });
    it('should not modify the first second of the next week', () => {
        turnsInto(nextWeekFirstSecond, nextWeekFirstSecond);
    });
});

function turnsInto(dateA: string, dateB: string) {
    expect(getFirstSecondOfWeek(new Date(dateA)).getTime()).toBe(new Date(dateB).getTime());
}
