import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as httpContext from 'express-http-context';

export interface Route {
    path: string
    method: string
    action: Function
    middlewares?: Function | Function[]
}

export class Router {
    async load(routes: Route[]): Promise<express.Router> {
        const router = express.Router();
        router.use(httpContext.middleware);

        routes.forEach(async (route: Route): Promise<void> => {
            if (!route.middlewares) {
                route.middlewares = [];
            }

            router[route.method](route.path, route.middlewares, async (request: Request, response: Response, next: NextFunction): Promise<void> => {
                route.action(request, response)
                    .then(() => next)
                    .catch((err: Error) => next(err));
            });
        });

        return router;
    }
}