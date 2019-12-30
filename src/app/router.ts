import * as express from 'express';
import { Request, Response, NextFunction } from 'express';

export interface Route {
    path: string
    method: string
    action: Function
    middlewares?: Function | Function[]
}

export class Router {
    load(routes: Route[]): express.Router {
        const router = express.Router();

        routes.forEach((route: Route) => {
            if (!route.middlewares) {
                route.middlewares = [];
            }

            router[route.method](route.path, route.middlewares, (request: Request, response: Response, next: NextFunction) => {
                route.action(request, response)
                    .then(() => next)
                    .catch((err: Error) => next(err));
            });
        });

        return router;
    }
}