import { createRewards } from './createRewards';
import { Rewards } from '../database/database';

describe('createRewards', () => {
    it('should generate rewards', () => {
        const date = new Date('2020-03-15T00:00:00Z');
        const rewards: Rewards = [
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
        expect(createRewards(date)).toEqual(rewards);
    });
});
