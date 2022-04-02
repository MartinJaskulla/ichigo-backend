import express, { Response } from 'express';
import { createRewards } from '../utils/createRewards';
import { getFirstSecondOfWeek } from '../utils/getFirstSecondOfWeek';
import { handleError, inputValidation, CustomError } from '../utils/inputValidation';
import { formatDate } from '../utils/formatDate';
import { Database, Reward, Rewards } from '../database/database';

type SuccessResponse<T> = {
    data: T;
};

type ErrorResponse = {
    error: {
        message: string;
    };
};

export function getRewardsRoutes(database: Database) {
    const rewardsRoutes = express.Router();

    // /users/1/rewards?at=2020-03-19T12:00:00Z
    rewardsRoutes.get('/users/:userId/rewards', async function getRewards(request, response: Response<SuccessResponse<Rewards> | ErrorResponse>) {
        try {
            inputValidation(request.params.userId, request.query.at, 'Query parameter', new Date());

            // firstSecondOfWeek will always be the first second of the current week, because inputValidation throws an error if request.query.at is not in the current week
            const firstSecondOfWeek = getFirstSecondOfWeek(new Date(request.query.at));

            const databaseRewards = database.getRewards(request.params.userId);
            if (databaseRewards) {
                const databaseRewardsAreFromThisWeek = new Date(databaseRewards[0].availableAt).getTime() === firstSecondOfWeek.getTime();
                if (databaseRewardsAreFromThisWeek) {
                    return response.status(200).send({ data: databaseRewards });
                }
                // databaseRewards are from a previous week, but the user made a valid request for this week, so we are creating new rewards
            }

            const rewards = createRewards(firstSecondOfWeek);
            database.setRewards(request.params.userId, rewards);
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

                const databaseRewards = database.getRewards(request.params.userId);
                if (!databaseRewards) {
                    throw new CustomError(404, `Cannot redeem reward, because there are no rewards for parameter 'userId': '${request.params.userId}'`);
                }

                const matchingRewardIndex = databaseRewards.findIndex((databaseReward) => databaseReward.availableAt === request.params.redeemDate);
                const matchingReward = databaseRewards[matchingRewardIndex];
                if (!matchingReward) {
                    throw new CustomError(
                        // I could also throw a 410 or 422 and clear the database
                        404,
                        `Cannot redeem reward, because there is no matching reward for parameter 'redeemDate': '${request.params.redeemDate}'`
                    );
                }

                if (matchingReward.redeemedAt) {
                    throw new CustomError(409, `Reward already redeemed`);
                }

                const updatedReward: Reward = { ...matchingReward, redeemedAt: formatDate(new Date()) };

                database.setRewards(request.params.userId, [
                    ...databaseRewards.slice(0, matchingRewardIndex),
                    updatedReward,
                    ...databaseRewards.slice(matchingRewardIndex + 1, databaseRewards.length),
                ] as Rewards);

                response.status(200).send({ data: updatedReward });
            } catch (error: unknown) {
                handleError(error, response);
            }
        }
    );

    return rewardsRoutes;
}
