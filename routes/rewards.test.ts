import { makeApp } from '../app';
import { makeDatabase, Rewards } from '../database/database';
import { Express } from 'express';
import request from 'supertest';

const USER_ID = 1;
const NOW = '2020-03-19T12:01:20Z';

describe('rewards.ts', () => {
    // Needed for jest.setSystemTime
    beforeAll(() => jest.useFakeTimers('modern'));
    afterAll(() => jest.useRealTimers());

    let app: Express;

    // I prefer integration tests (using the real database) over passing a mocked database: {getRewards: jest.fn(), setRewards: jest.fn()}
    beforeEach(() => (app = makeApp(makeDatabase('development'))));

    describe('GET', () => {
        const GET_REQUEST_TIME = '2020-03-19T12:00:00Z';

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
                app = makeApp(makeDatabase('development', { [USER_ID]: currentRewards }));
                const response = await request(app).get(`/users/${USER_ID}/rewards?at=${GET_REQUEST_TIME}`);
                expect(response.status).toBe(200);
                expect(response.body.data).toEqual(currentRewards);
            });
            it('should create new rewards if the user has rewards in the database which are older than one week', async () => {
                jest.setSystemTime(new Date(NOW));
                app = makeApp(makeDatabase('development', { [USER_ID]: oldRewards }));
                const response = await request(app).get(`/users/${USER_ID}/rewards?at=${GET_REQUEST_TIME}`);
                expect(response.status).toBe(201);
                expect(response.body.data).toEqual(currentRewards);
            });
            it('should create new rewards if the user does not have any in the database', async () => {
                jest.setSystemTime(new Date(NOW));
                const response = await request(app).get(`/users/${USER_ID}/rewards?at=${GET_REQUEST_TIME}`);
                expect(response.status).toBe(201);
                expect(response.body.data).toEqual(currentRewards);
            });
            // Given more time, I would add tests for different userId etc.
        });
    });
    describe('PATCH', () => {
        const PATCH_REDEEM_INDEX = 0;

        describe('Invalid requests', () => {
            it('should handle invalid user ids', async () => {
                jest.setSystemTime(new Date(NOW));
                const response = await request(app).patch(`/users/invalid/rewards/${currentRewards[PATCH_REDEEM_INDEX].availableAt}/redeem`);
                expect(response.status).toBe(400);
                expect(response.body.error.message).toBe("Parameter 'userId' must be a number. You provided: 'invalid'");
            });
            // Given more time, I would move the tests from inputValidation.test.ts here as I prefer integration tests over unit tests
        });
        describe('Valid requests', () => {
            it('should return 404 if the user does not have any rewards in the database', async () => {
                jest.setSystemTime(new Date(NOW));
                const response = await request(app).patch(`/users/${USER_ID}/rewards/${currentRewards[PATCH_REDEEM_INDEX].availableAt}/redeem`);
                expect(response.status).toBe(404);
                expect(response.body.error.message).toBe(`Cannot redeem reward, because there are no rewards for parameter 'userId': '${USER_ID}'`);
            });
            it('should return 404 if the user has rewards in the database, but the redeem date does not match any of them', async () => {
                jest.setSystemTime(new Date(NOW));
                app = makeApp(makeDatabase('development', { [USER_ID]: oldRewards }));
                const response = await request(app).patch(`/users/${USER_ID}/rewards/${currentRewards[PATCH_REDEEM_INDEX].availableAt}/redeem`);
                expect(response.status).toBe(404);
                expect(response.body.error.message).toBe(
                    `Cannot redeem reward, because there is no matching reward for parameter 'redeemDate': '${currentRewards[PATCH_REDEEM_INDEX].availableAt}'`
                );
            });
            it('should return 409 if the user tries to redeem a reward for a second time', async () => {
                jest.setSystemTime(new Date(NOW));
                const alreadyRedeemedRewards: Rewards = currentRewards.map((reward) => ({
                    ...reward,
                    redeemedAt: reward.availableAt,
                })) as Rewards;
                app = makeApp(makeDatabase('development', { [USER_ID]: alreadyRedeemedRewards }));
                const response = await request(app).patch(`/users/${USER_ID}/rewards/${currentRewards[PATCH_REDEEM_INDEX].availableAt}/redeem`);
                expect(response.status).toBe(409);
                expect(response.body.error.message).toBe('Reward already redeemed');
            });
            it('should return 200 if a reward was successfully redeemed in the database', async () => {
                jest.setSystemTime(new Date(NOW));
                app = makeApp(makeDatabase('development', { [USER_ID]: currentRewards }));
                const response = await request(app).patch(`/users/${USER_ID}/rewards/${currentRewards[PATCH_REDEEM_INDEX].availableAt}/redeem`);
                expect(response.status).toBe(200);
                expect(response.body.data).toEqual({ ...currentRewards[PATCH_REDEEM_INDEX], redeemedAt: NOW });
            });
        });
    });
});

const currentRewards: Rewards = [
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

const oldRewards: Rewards = [
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
