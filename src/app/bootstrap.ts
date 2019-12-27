import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Route, Router } from './router';

export function bootstrap(routes: Route[]): express.Application {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(new Router().load(routes));

    return app;
}
