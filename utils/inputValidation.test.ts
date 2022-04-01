import { inputValidation } from './inputValidation';

describe('inputValidation', () => {
    it('should throw on invalid userId', () => {
        expect(() => inputValidation('invalid', 'invalid', 'Parameter', new Date())).toThrow(
            expect.objectContaining({ code: 400, message: "Parameter 'userId' must be a number. You provided: 'invalid'" })
        );
    });
    it('should throw on invalid "at" date', () => {
        expect(() => inputValidation('1', 'invalid', 'Parameter', new Date())).toThrow(
            expect.objectContaining({
                code: 400,
                message: "Parameter 'at' must be a date e.g. '2020-03-19T12:00:00Z'. You provided: 'invalid'",
            })
        );
    });
    it('should throw on valid "at" date, which is outside the current week', () => {
        expect(() => inputValidation('1', '2020-03-19T12:00:00Z', 'Parameter', new Date('2022-03-19T12:00:00.000Z'))).toThrow(
            expect.objectContaining({
                code: 403,
                message: "Parameter 'at' is outside the current week. You provided: '2020-03-19T12:00:00Z'",
            })
        );
    });
    it('should not throw if everything is valid', () => {
        expect(() => inputValidation('1', '2020-03-19T12:00:00Z', 'Parameter', new Date('2020-03-19T12:00:00.000Z'))).not.toThrow();
    });
});
