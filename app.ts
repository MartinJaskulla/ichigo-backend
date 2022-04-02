import express, { Express } from 'express';
import { getRewardsRoutes } from './routes/rewards';
import { Database } from './database/database';

export function makeApp(database: Database) {
    const app: Express = express();

    app.use('/', getRewardsRoutes(database));

    return app;
}
