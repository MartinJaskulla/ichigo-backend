import { getFirstSecondOfWeek } from './getFirstSecondOfWeek';
import { Response } from 'express';

export class CustomError extends Error {
    constructor(public code: number, message: string) {
        super(message);
        // https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

export function inputValidation(userId: string, at: unknown, atType: 'Parameter' | 'Query parameter', now: Date): asserts at is string {
    validateUserId(userId);
    validateAt(at, atType);
    validateAtInCurrentWeek(at, atType, now);
}

function validateUserId(userId: string): void | never {
    if (isNaN(Number(userId))) {
        throw new CustomError(400, `Parameter 'userId' must be a number. You provided: '${userId}'`);
    }
}

function validateAt(at: unknown, type: 'Parameter' | 'Query parameter'): asserts at is string {
    if (typeof at !== 'string' || isNaN(Date.parse(at))) {
        throw new CustomError(400, `${type} 'at' must be a date e.g. '2020-03-19T12:00:00Z'. You provided: '${at}'`);
    }
}

function validateAtInCurrentWeek(at: string, type: 'Parameter' | 'Query parameter', now: Date): void | never {
    const firstSecondOfWeekRequest = getFirstSecondOfWeek(new Date(at));
    const firstSecondOfWeekServer = getFirstSecondOfWeek(now);
    const isInCurrentWeek = firstSecondOfWeekRequest.getTime() === firstSecondOfWeekServer.getTime();
    if (!isInCurrentWeek) {
        throw new CustomError(403, `${type} 'at' is outside the current week. You provided: '${at}'`);
    }
}

export function handleError(error: unknown, response: Response) {
    // console.error will be hidden in unit test by the silent flag: jest --coverage --silent
    console.error(error);
    if (error instanceof CustomError) {
        response.status(error.code).send({
            error: {
                message: error.message,
            },
        });
    } else {
        response.status(500).send({
            error: {
                message: 'Something went wrong.',
            },
        });
    }
}
