import './app/env';
import 'reflect-metadata';

import * as path from 'path';
import * as express from 'express';
import * as httpContext from 'express-http-context';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import { createConnection } from 'typeorm';
import { Request, Response, NextFunction } from 'express';
import { routes, Route } from './routes';
import { DomainError } from './app/error';

const PORT = Number(process.env.PORT || 3000);
const HOST = String(process.env.HOST || 'localhost');

// Create express app.
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Important: Add the http context after the bodyParser middleware.
app.use(httpContext.middleware);
app.use(express.static(path.join(__dirname, 'public')));

// Register express routes from defined application routes.
routes.forEach((route: Route) => {
    const middlewares = route.middlewares || [];

    (app as any)[route.method](route.route, middlewares, (request: Request, response: Response, next: NextFunction) => {
        const result = (new (route.controller as any))[route.action](request, response, next);

        if (result instanceof Promise) {
            result.then(result => result !== null && result !== undefined ? response.send(result) : undefined)
                .catch(error => error instanceof DomainError ? response.status(error.code).json(error) : response.json(error));
        } else if (result !== null && result !== undefined) {
            response.json(result);
        }
    });
});

app.use(async (error: Error | DomainError, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof DomainError) {
        response.status(error.code);
    }
    response.json(error);
});

module.exports = app.listen(PORT, HOST, async () => {
    try {
        console.log(`[Express] is listenning on ${HOST}:${PORT}`);
        await createConnection();
    } catch (error) {
        console.log(`[TypeORM] connection error: ${error}`);
    }
});
