import { formatDate } from './formatDate';

describe('formatDate', () => {
    it('should return the result of .toISOString() without the milliseconds', () => {
        const date = '2022-04-01T13:27:12Z';
        expect(formatDate(new Date(date))).toBe(date);
    });
});
