import { formatDate } from './formatDate';
import { Reward, Rewards } from '../database/database';

export function createRewards(firstSecondOfWeek: Date): Rewards {
    return [
        generateReward(firstSecondOfWeek, 0),
        generateReward(firstSecondOfWeek, 1),
        generateReward(firstSecondOfWeek, 2),
        generateReward(firstSecondOfWeek, 3),
        generateReward(firstSecondOfWeek, 4),
        generateReward(firstSecondOfWeek, 5),
        generateReward(firstSecondOfWeek, 6),
    ];
}

function generateReward(firstSecondOfWeek: Date, dayOffset: number): Reward {
    // Make a copy the date to prevent .setUTCDate() from mutating the input
    const day = new Date(firstSecondOfWeek);
    day.setUTCDate(firstSecondOfWeek.getUTCDate() + dayOffset);

    const dayPlusOne = new Date(day);
    dayPlusOne.setUTCDate(day.getUTCDate() + 1);

    return {
        availableAt: formatDate(day),
        expiresAt: formatDate(dayPlusOne),
        redeemedAt: null,
    };
}
