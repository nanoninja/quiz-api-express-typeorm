import './app/env';
import 'reflect-metadata';

import * as path from 'path';
import * as express from 'express';
import { routes } from './app/routes';
import { bootstrap } from './app/bootstrap';
import { createConnection, Connection } from 'typeorm';

const PORT = Number(process.env.PORT);
const HOST = String(process.env.HOST);

createConnection()
    .then(async (connection: Connection) => {
        const app = await bootstrap(routes);

        app.use(express.static(path.join(__dirname, 'public')));
        app.listen(PORT, HOST, () => {
            console.log(`[Express] is listenning on ${HOST}:${PORT}`);
        });
    })
    .catch((err: Error) => {
        console.log(`[TypeORM] connection error: ${err}`);
    });
