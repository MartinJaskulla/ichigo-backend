import dotenv from 'dotenv';
import { makeDatabase } from './database/database';
import { makeApp } from './app';

dotenv.config();
const port = process.env.PORT as string;
const environment = process.env.ENVIRONMENT as string;

// Use dependency injection to easily change between databases e.g.
// MySQL for production, inMemoryDatabase for development, mockDatabase for testing
const app = makeApp(makeDatabase(environment));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
