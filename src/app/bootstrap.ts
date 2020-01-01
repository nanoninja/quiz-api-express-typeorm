import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as httpContext from 'express-http-context';
import { Request, Response, NextFunction } from 'express';
import { Route, Router } from './router';
import { createError } from './error';

export async function bootstrap(routes: Route[]): Promise<express.Application> {
    const app = express();

    app.use(httpContext.middleware);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(await (new Router().load(routes)));

    app.use(async (error: Error, request: Request, response: Response, next: NextFunction): Promise<void> => {
        if (error) {
            const err = createError(500, 'Internal Server Error');
            response.status(err.status).json(err);
            return;
        }
    });

    return app;
}
