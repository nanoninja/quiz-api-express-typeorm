import './app/env';
import 'reflect-metadata';

import * as path from 'path';
import * as express from 'express';
import * as httpContext from 'express-http-context';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import { createConnection, Connection } from 'typeorm';
import { Request, Response } from 'express';
import { routes, Route } from './routes';

const PORT = Number(process.env.PORT);
const HOST = String(process.env.HOST);

createConnection().then(async (connection: Connection) => {

    // Create express app.
    const app = express();

    app.use(cors());
    app.use(httpContext.middleware);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, 'public')));

    // Register express routes from defined application routes.
    routes.forEach((route: Route) => {
        if (!route.middlewares) {
            route.middlewares = [];
        }

        (app as any)[route.method](route.route, route.middlewares, (request: Request, response: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](request, response, next);

            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? response.send(result) : undefined);
            } else if (result !== null && result !== undefined) {
                response.json(result);
            }

        });
    });

    app.listen(PORT, HOST, () => {
        console.log(`[Express] is listenning on ${HOST}:${PORT}`);
    });

}).catch((err: Error) => {
    console.log(`[TypeORM] connection error: ${err}`);
});
