import * as express from 'express';
import * as bodyParser from 'body-parser';

import { Router } from './router/Router';
import { Route } from './router/Route';

export function bootstrap(routes: Route[]): express.Application {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(new Router().load(routes));

    return app;
}
