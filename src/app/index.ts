import 'reflect-metadata';

import * as path from 'path';
import * as express from 'express';
import * as httpContext from 'express-http-context';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

import { Request, Response, NextFunction, Application } from 'express';
import { routes, Route } from '../routes';
import { DomainError } from './error';

const app: Application = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(httpContext.middleware);
app.use(express.static(path.join(__dirname, 'public')));

routes.forEach((route: Route) => {
    const middlewares = route.middlewares || [];

    (app as any)[route.method](route.route, middlewares, (request: Request, response: Response, next: NextFunction) => {
        const result = (new (route.controller as any))[route.action](request, response, next);

        if (result instanceof Promise) {
            result.then(result => result !== null && result !== undefined ? response.send(result) : undefined)
                .catch(error => error instanceof DomainError ? response.status(error.status).json(error) : response.json(error));
        } else if (result !== null && result !== undefined) {
            response.json(result);
        }
    });
});

app.use((error: Error | DomainError, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof DomainError) {
        response.status(error.status);
    }
    response.json(error);
});

export { app };
