import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as httpContext from 'express-http-context';
import * as uuidv4 from 'uuid/v4';
import { Request, Response, NextFunction } from 'express';
import { Route, Router } from './router';

export function bootstrap(routes: Route[]): express.Application {
    const app = express();

    app.use(httpContext.middleware);
    app.use((request: Request, response: Response, next: NextFunction) => {
        httpContext.set('request:id', uuidv4());
        next();
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(new Router().load(routes));

    app.use(function (error: Error, request: Request, response: Response, next: NextFunction) {
        if (error) {
            response.status(500).json(error);
        }
    });

    return app;
}
