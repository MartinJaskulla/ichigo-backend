import { makeApp } from '../app';
import { makeDatabase, Rewards } from '../database/database';
import { Express } from 'express';
import request from 'supertest';

const USER_ID = 1
const NOW = '2020-03-19T12:01:20Z'
const GET_REQUEST_TIME = '2020-03-19T12:00:00Z'
const PATCH_REDEEM_DATE = '2020-03-18T00:00:00Z'

describe('rewards.ts', () => {
    // Needed for jest.setSystemTime
    beforeAll(() => jest.useFakeTimers('modern'));
    afterAll(() => jest.useRealTimers());

    let app: Express;

    // I prefer integration tests (using the real database) over passing a mocked database: {getRewards: jest.fn(), setRewards: jest.fn()}
    beforeEach(() => (app = makeApp(makeDatabase('development'))));

    describe('GET', () => {
        describe('Invalid requests', () => {
            it('should handle invalid user ids', async () => {
                jest.setSystemTime(new Date(NOW));
                const response = await request(app).get(`/users/invalid/rewards?at=${GET_REQUEST_TIME}`);
                expect(response.status).toBe(400);
                expect(response.body.error.message).toBe("Parameter 'userId' must be a number. You provided: 'invalid'");
            });
            // Given more time, I would move the tests from inputValidation.test.ts here as I prefer integration tests over unit tests
        });
        describe('Valid requests', () => {
            it('should return existing rewards if the user has rewards in the database', async () => {
                jest.setSystemTime(new Date(NOW));
                app = makeApp(makeDatabase('development', {[USER_ID]: rewardsOfCurrentWeek}));
                const response = await request(app).get(`/users/${USER_ID}/rewards?at=${GET_REQUEST_TIME}`);
                expect(response.status).toBe(200);
                expect(response.body.data).toEqual(rewardsOfCurrentWeek);
            });
            it('should create new rewards if the user has rewards in the database which are older than one week', async () => {
                jest.setSystemTime(new Date(NOW));
                app = makeApp(makeDatabase('development', {[USER_ID]: rewardsOlderThanTheCurrentWeek}));
                const response = await request(app).get(`/users/${USER_ID}/rewards?at=${GET_REQUEST_TIME}`);
                expect(response.status).toBe(201);
                expect(response.body.data).toEqual(rewardsOfCurrentWeek);
            });
            it('should create new rewards if the user does not have any in the database', async () => {
                jest.setSystemTime(new Date(NOW));
                const response = await request(app).get(`/users/${USER_ID}/rewards?at=${GET_REQUEST_TIME}`);
                expect(response.status).toBe(201);
                expect(response.body.data).toEqual(rewardsOfCurrentWeek);
            });
            // Given more time, I would add tests for different userId etc.
        });
    });
})

const rewardsOfCurrentWeek: Rewards = [
    {
        availableAt: '2020-03-15T00:00:00Z',
        expiresAt: '2020-03-16T00:00:00Z',
        redeemedAt: null,
    },
    {
        availableAt: '2020-03-16T00:00:00Z',
        expiresAt: '2020-03-17T00:00:00Z',
        redeemedAt: null,
    },
    {
        availableAt: '2020-03-17T00:00:00Z',
        expiresAt: '2020-03-18T00:00:00Z',
        redeemedAt: null,
    },
    {
        availableAt: '2020-03-18T00:00:00Z',
        expiresAt: '2020-03-19T00:00:00Z',
        redeemedAt: null,
    },
    {
        availableAt: '2020-03-19T00:00:00Z',
        expiresAt: '2020-03-20T00:00:00Z',
        redeemedAt: null,
    },
    {
        availableAt: '2020-03-20T00:00:00Z',
        expiresAt: '2020-03-21T00:00:00Z',
        redeemedAt: null,
    },
    {
        availableAt: '2020-03-21T00:00:00Z',
        expiresAt: '2020-03-22T00:00:00Z',
        redeemedAt: null,
    },
];

const rewardsOlderThanTheCurrentWeek: Rewards = [
    {
        availableAt: '2019-03-15T00:00:00Z',
        expiresAt: '2019-03-16T00:00:00Z',
        redeemedAt: null,
    },
    {
        availableAt: '2019-03-16T00:00:00Z',
        expiresAt: '2019-03-17T00:00:00Z',
        redeemedAt: null,
    },
    {
        availableAt: '2019-03-17T00:00:00Z',
        expiresAt: '2019-03-18T00:00:00Z',
        redeemedAt: null,
    },
    {
        availableAt: '2019-03-18T00:00:00Z',
        expiresAt: '2019-03-19T00:00:00Z',
        redeemedAt: null,
    },
    {
        availableAt: '2019-03-19T00:00:00Z',
        expiresAt: '2019-03-20T00:00:00Z',
        redeemedAt: null,
    },
    {
        availableAt: '2019-03-20T00:00:00Z',
        expiresAt: '2019-03-21T00:00:00Z',
        redeemedAt: null,
    },
    {
        availableAt: '2019-03-21T00:00:00Z',
        expiresAt: '2019-03-22T00:00:00Z',
        redeemedAt: null,
    },
];
