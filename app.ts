import express, { Express } from 'express';
import cors from 'cors';
import { getRewardsRoutes } from './routes/rewards';
import { Database } from './database/database';

export function makeApp(database: Database) {
    const app: Express = express();

    app.use(cors());

    app.use('/', getRewardsRoutes(database));

    return app;
}
