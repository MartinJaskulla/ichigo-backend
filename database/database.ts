import { InMemoryDatabase } from './inMemoryDatabase';

export type Reward = {
    availableAt: string; // 2020-03-16T00:00:00Z | This will always be 00:00:00 for Su - Sa
    expiresAt: string; // 2020-03-17T00:00:00Z | Always 24h after availableAt
    redeemedAt: string | null; // 2020-03-18T12:12:11Z | Set by the server to the current time when receiving the request
};
export type Rewards = [Reward, Reward, Reward, Reward, Reward, Reward, Reward];

export type Data = { [userId: string]: Rewards };
export type Database = {
    getRewards: (userId: string) => Rewards | undefined;
    setRewards: (userId: string, rewards: Rewards) => void;
};

const databases: { [environment: string]: new (initialData?: Data) => InMemoryDatabase } = {
    development: InMemoryDatabase,
    // production: mySQL,
};

export function makeDatabase(environment: string, initialData?: Data) {
    return new databases[environment](initialData);
}
