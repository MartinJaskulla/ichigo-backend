import express, { Response } from 'express';
import { createRewards } from '../utils/createRewards';
import { inMemoryDatabase, Reward, Rewards } from '../utils/inMemoryDatabase';
import { getFirstSecondOfWeek } from '../utils/getFirstSecondOfWeek';
import { handleError, inputValidation, CustomError } from '../utils/inputValidation';
import { formatDate } from '../utils/formatDate';

export const rewardsRoutes = express.Router();

type SuccessResponse<T> = {
    data: T;
};

type ErrorResponse = {
    error: {
        message: string;
    };
};

// /users/1/rewards?at=2020-03-19T12:00:00Z
rewardsRoutes.get('/users/:userId/rewards', async function getRewards(request, response: Response<SuccessResponse<Rewards> | ErrorResponse>) {
    try {
        inputValidation(request.params.userId, request.query.at, 'Query parameter', new Date());

        const firstSecondOfWeek = getFirstSecondOfWeek(new Date(request.query.at));

        if (request.params.userId in inMemoryDatabase) {
            const databaseRewards = inMemoryDatabase[request.params.userId];
            const databaseRewardsAreFromThisWeek = new Date(databaseRewards[0].availableAt).getTime() === firstSecondOfWeek.getTime();
            if (databaseRewardsAreFromThisWeek) {
                return response.status(200).send({ data: databaseRewards });
            }
            // databaseRewards are from a previous week, but the user made a valid request for this week, so we are creating new rewards
        }

        const rewards = createRewards(firstSecondOfWeek);
        inMemoryDatabase[request.params.userId] = rewards;

        response.status(201).send({ data: rewards });
    } catch (error: unknown) {
        handleError(error, response);
    }
});

// /users/1/rewards/2020-03-18T00:00:00Z/redeem
rewardsRoutes.patch(
    '/users/:userId/rewards/:redeemDate/redeem',
    async function redeemReward(request, response: Response<SuccessResponse<Reward> | ErrorResponse>) {
        try {
            inputValidation(request.params.userId, request.params.redeemDate, 'Parameter', new Date());

            if (!(request.params.userId in inMemoryDatabase)) {
                throw new CustomError(404, `No rewards found for parameter 'userId': '${request.params.userId}'`);
            }

            const databaseRewards = inMemoryDatabase[request.params.userId];
            const matchingRewardIndex = databaseRewards.findIndex((databaseReward) => databaseReward.availableAt === request.params.redeemDate);
            const matchingReward = databaseRewards[matchingRewardIndex];
            if (!matchingReward) {
                throw new CustomError(404, `No rewards found for parameter 'redeemDate': '${request.params.redeemDate}'`);
            }

            if (matchingReward.redeemedAt) {
                throw new CustomError(409, `Reward already redeemed`);
            }

            const updatedReward: Reward = { ...matchingReward, redeemedAt: formatDate(new Date()) };

            inMemoryDatabase[request.params.userId] = [
                ...databaseRewards.slice(0, matchingRewardIndex),
                updatedReward,
                ...databaseRewards.slice(matchingRewardIndex + 1, databaseRewards.length),
            ] as Rewards;

            response.status(200).send({ data: updatedReward });
        } catch (error: unknown) {
            handleError(error, response);
        }
    }
);
