export interface Reward {
    availableAt: string; // 2020-03-16T00:00:00Z | This will always be 00:00:00 for Su - Sa
    expiresAt: string; // 2020-03-17T00:00:00Z | Always 24h after availableAt
    redeemedAt: string | null; // 2020-03-18T12:12:11Z | Set by the server to the current time when receiving the request
}

export type Rewards = [Reward, Reward, Reward, Reward, Reward, Reward, Reward];

type InMemoryDatabase = {
    [userId: string]: Rewards;
};

export const inMemoryDatabase: InMemoryDatabase = {
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
