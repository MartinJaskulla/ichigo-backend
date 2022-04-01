import express, { Express } from 'express';
import dotenv from 'dotenv';
import { rewardsRoutes } from './routes/rewards';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use('/', rewardsRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
