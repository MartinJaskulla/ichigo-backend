import { Database, Rewards } from './database';

export class InMemoryDatabase implements Database {
    private data: { [userId: string]: Rewards } = {
        // To test scenario where databaseRewards are from a previous week, but the user made a valid request for this week, so we are creating new rewards
        // 1: [
        //     {"availableAt": "2020-03-15T00:00:00Z", "redeemedAt": null, "expiresAt": "2020-03-16T00:00:00Z"},
        //     {"availableAt": "2020-03-16T00:00:00Z", "redeemedAt": null, "expiresAt": "2020-03-17T00:00:00Z"},
        //     {"availableAt": "2020-03-17T00:00:00Z", "redeemedAt": null, "expiresAt": "2020-03-18T00:00:00Z"},
        //     {"availableAt": "2020-03-18T00:00:00Z", "redeemedAt": null, "expiresAt": "2020-03-19T00:00:00Z"},
        //     {"availableAt": "2020-03-19T00:00:00Z", "redeemedAt": null, "expiresAt": "2020-03-20T00:00:00Z"},
        //     {"availableAt": "2020-03-20T00:00:00Z", "redeemedAt": null, "expiresAt": "2020-03-21T00:00:00Z"},
        //     {"availableAt": "2020-03-21T00:00:00Z", "redeemedAt": null, "expiresAt": "2020-03-22T00:00:00Z"}
        // ]
    };

    getRewards(userId: string) {
        return this.data[userId];
    }

    setRewards(userId: string, rewards: Rewards) {
        this.data[userId] = rewards;
    }
}
