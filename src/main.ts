import 'reflect-metadata';

import { createConnection } from 'typeorm';
import { app } from './app';

const PORT = Number(process.env.PORT || 3000);
const HOST = String(process.env.HOST || 'localhost');

const server = app.listen(PORT, HOST, async () => {
    try {
        console.log(`[Express] is listening on ${HOST}:${PORT}`);
        await createConnection();
    } catch (error) {
        console.log(`[TypeORM] connection error: ${error}`);
    }
});

export { server };
