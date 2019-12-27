import './app/env';
import 'reflect-metadata';

import * as path from 'path';
import * as express from 'express';
import { createConnection, Connection } from 'typeorm';
import { routes } from './app/routes';
import { bootstrap } from './app/bootstrap';

const PORT = Number(process.env.PORT);
const HOST = String(process.env.HOST);

createConnection()
    .then(async (connection: Connection) => {
        const app = bootstrap(routes);

        app.use(express.static(path.join(__dirname, 'public')));
        app.listen(PORT, HOST, () => {
            console.log(`[Express] is listenning on ${HOST}:${PORT}`);
        });
    })
    .catch((err: Error) => {
        console.log(`[TypeORM] connection error: ${err}`);
    });
